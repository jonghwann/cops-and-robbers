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

export interface MeetingMember {
  userId: string;
  name: string;
  avatarUrl: string | null;
}

export interface UpdateMeetingRequest {
  meetingId: string;
  title: string;
  description: string;
  imageUri?: string;
}

export interface MeetingSchedule {
  id: string;
  meetingId: string;
  title: string;
  startsAt: string;
  locationName: string;
  locationUrl: string;
  capacity: number;
  createdAt: string;
}

export interface CreateMeetingScheduleRequest {
  meetingId: string;
  title: string;
  startsAt: string;
  locationName: string;
  locationUrl: string;
  capacity: number;
}
