export interface ChatMessage {
  id: string;
  meetingId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

export interface ChatMessagesCursor {
  createdAt: string;
  id: string;
}

export interface GetChatMessagesRequest {
  meetingId: string;
  cursor?: ChatMessagesCursor;
  limit?: number;
}

export interface SendMessageRequest {
  meetingId: string;
  content: string;
}
