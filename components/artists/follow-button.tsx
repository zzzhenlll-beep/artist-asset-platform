"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  artistId: string;
  initialFollowing?: boolean;
}

export function FollowButton({ artistId, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/artists/${artistId}/follow`, { method: "POST" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = (await res.json()) as { following: boolean };
      setFollowing(data.following);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={following ? "accent" : "secondary"}
      size="lg"
      disabled={loading}
      onClick={toggle}
    >
      <UserPlus className="h-4 w-4" />
      {following ? "已关注" : "关注艺术家"}
    </Button>
  );
}
