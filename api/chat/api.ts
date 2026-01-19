import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type {
  ChatMessage,
  ChatMessagesCursor,
  GetChatMessagesRequest,
  SendMessageRequest,
} from './type';

export async function getChatMessages(
  params: GetChatMessagesRequest,
): Promise<{ messages: ChatMessage[]; nextCursor: ChatMessagesCursor | null; hasMore: boolean }> {
  const user = await requireUser();
  const limit = params.limit ?? 30;

  let query = supabase
    .from('chat_messages')
    .select('*, profiles(name, avatar_url)')
    .eq('meeting_id', params.meetingId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit + 1);

  if (params.cursor) {
    const { createdAt, id } = params.cursor;
    query = query.or(`created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${id})`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const pageRows = rows.slice(0, limit);

  const messages: ChatMessage[] = pageRows.map((row: any) => ({
    id: row.id,
    meetingId: row.meeting_id,
    userId: row.user_id,
    userName: row.profiles?.name ?? '',
    userAvatarUrl: row.profiles?.avatar_url ?? null,
    content: row.content,
    createdAt: row.created_at,
    isOwn: row.user_id === user.id,
  }));

  const lastRow = pageRows[pageRows.length - 1];
  const nextCursor = lastRow ? { createdAt: lastRow.created_at, id: lastRow.id } : null;

  return { messages, nextCursor, hasMore };
}

export async function sendMessage(params: SendMessageRequest): Promise<void> {
  const user = await requireUser();

  const content = params.content.trim();
  if (!content) throw new Error('메시지 내용이 비어있습니다.');

  const { error } = await supabase.from('chat_messages').insert({
    meeting_id: params.meetingId,
    user_id: user.id,
    content,
  });

  if (error) throw error;
}
