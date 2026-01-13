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
