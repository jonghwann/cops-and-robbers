export interface Meeting {
  id: string;
  hostId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  region2: string;
  memberCount: number;
  createdAt: string;
  isFavorite: boolean;
  isJoined?: boolean;
}
