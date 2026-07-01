import { NextResponse } from "next/server";

import { mockLogin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const phone = body.phone?.trim();
    if (!phone) {
      return NextResponse.json({ error: "请输入手机号" }, { status: 400 });
    }

    if (process.env.MOCK_AUTH !== "true" && !body.code) {
      return NextResponse.json({ error: "请输入验证码" }, { status: 400 });
    }

    const user = await mockLogin(phone);
    return NextResponse.json({
      ok: true,
      user: { id: user.id, phone: user.phone, nickname: user.nickname, role: user.role },
    });
  } catch {
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
