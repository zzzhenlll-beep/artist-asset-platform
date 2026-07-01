import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

export default async function LegacyWorkRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = await prisma.work.findUnique({
    where: { id },
    select: { creatorId: true },
  });
  if (!work) redirect("/discover");
  redirect(`/artists/${work.creatorId}/works/${id}`);
}
