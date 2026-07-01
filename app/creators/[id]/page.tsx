import { redirect } from "next/navigation";

export default async function LegacyCreatorRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/artists/${id}`);
}
