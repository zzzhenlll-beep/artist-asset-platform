export interface WorkCardData {
  id: string;
  title: string;
  image: string;
  creatorId: string;
  creatorName?: string;
  tags: string[];
  viewCount: number;
  favoriteCount: number;
  rating?: { score: number };
  aiGenerated?: boolean;
  href: string;
}

export interface ArtistCardData {
  id: string;
  name: string;
  avatar: string;
  city?: string | null;
  medium?: string | null;
  keywords: string[];
  workCount: number;
  followerCount: number;
  coverImage?: string;
}

export interface Rating {
  score: number;
  comment: string;
  expertName: string;
}

export type WorkStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type SaleStatus = "UNSOLD" | "SOLD" | "PRIVATE";

export interface CollaborationIntent {
  id: string;
  workTitle: string;
  contactName: string;
  purpose: string;
  status: "PENDING" | "CONTACTED" | "CLOSED";
  createdAt: string;
}
