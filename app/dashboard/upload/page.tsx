import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import UploadPage from "./upload-client";

export default async function UploadPageWrapper() {
  const session = await getSessionUser();
  if (!session?.creatorId) redirect("/login");

  const series = await prisma.series.findMany({
    where: { creatorId: session.creatorId },
    select: { id: true, title: true },
    orderBy: { sortOrder: "asc" },
  });

  return <UploadPage series={series} />;
}
