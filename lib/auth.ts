import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

import { prisma } from "./db";
import { SITE_IMAGES } from "./site-images";

const COOKIE_NAME = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionUser {
  id: string;
  phone: string;
  nickname: string | null;
  avatarUrl: string | null;
  role: UserRole;
  creatorId: string | null;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  const userId = payload.sub;
  if (!userId) return null;
  return userId;
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const userId = await verifySessionToken(token);
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creator: { select: { id: true } } },
  });
  if (!user) return null;

  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    role: user.role,
    creatorId: user.creator?.id ?? null,
  };
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export async function requireCreator() {
  const user = await requireSessionUser();
  if (user.role !== "CREATOR" && user.role !== "ADMIN") throw new Error("FORBIDDEN");
  if (!user.creatorId) throw new Error("FORBIDDEN");
  return user;
}

export async function mockLogin(phone: string) {
  const normalized = phone.trim();
  const role =
    normalized === "13900000000"
      ? "ADMIN"
      : normalized === "13800000000"
        ? "CREATOR"
        : "USER";

  let user = await prisma.user.findUnique({
    where: { phone: normalized },
    include: { creator: true },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: normalized,
        nickname: role === "CREATOR" ? "林墨染" : role === "ADMIN" ? "平台管理员" : "访客用户",
        role,
        avatarUrl: role === "CREATOR" ? SITE_IMAGES.avatar : null,
      },
      include: { creator: true },
    });
  }

  if (user.role === "CREATOR" && !user.creator) {
    await prisma.creator.create({
      data: {
        userId: user.id,
        displayName: user.nickname,
        bio: "新晋艺术家，档案建设中。",
        keywords: ["当代艺术"],
        tags: ["创作"],
      },
    });
  }

  await setSessionCookie(user.id);
  return user;
}
