import { notFound } from "next/navigation";

import { ArtistArchive } from "@/components/artists/artist-archive";
import { getArtistArchive } from "@/lib/artists";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { artistDisplayName } from "@/lib/artists";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = await getArtistArchive(id);
  if (!artist) return { title: "艺术家未找到" };
  return { title: `${artistDisplayName(artist)} · 资产档案` };
}

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = await getArtistArchive(id);
  if (!artist) notFound();

  const session = await getSessionUser();
  let isFollowing = false;
  let isFollower = false;

  if (session) {
    const follow = await prisma.artistFollow.findUnique({
      where: { userId_creatorId: { userId: session.id, creatorId: id } },
    });
    isFollowing = !!follow;
    isFollower = !!follow;
  }

  return <ArtistArchive artist={artist} isFollowing={isFollowing} isFollower={isFollower} />;
}
