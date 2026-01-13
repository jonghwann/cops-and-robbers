export interface MeetingsCursor {
  createdAt: string;
  id: string;
}

export interface GetMeetingsRequest {
  region2: string;
  limit?: number;
  cursor?: MeetingsCursor | null;
}

export interface SetMeetingFavoriteRequest {
  meetingId: string;
  isFavorite: boolean;
}

export interface CreateMeetingRequest {
  region2: string;
  imageUri: string;
  title: string;
  description: string;
}
