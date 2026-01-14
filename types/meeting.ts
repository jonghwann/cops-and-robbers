export interface Meeting {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  region2: string;
  memberCount: number;
  createdAt: string;
  isFavorite: boolean;
  isJoined?: boolean;
}
