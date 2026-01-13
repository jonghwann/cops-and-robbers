import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Meeting } from '@/types/meeting';
import type { GetMeetingsRequest, MeetingsCursor, SetMeetingFavoriteRequest } from './type';

function toMeeting(row: any): Omit<Meeting, 'isFavorite'> {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    region2: row.region2,
    memberCount: row.member_count,
    createdAt: row.created_at,
  };
}

async function getFavoriteIdSet(userId: string, meetingIds: string[]) {
  if (meetingIds.length === 0) return new Set<string>();

  const { data, error } = await supabase
    .from('meeting_favorites')
    .select('meeting_id')
    .eq('user_id', userId)
    .in('meeting_id', meetingIds);

  if (error) throw error;

  return new Set((data ?? []).map((row) => row.meeting_id));
}

export async function getMeetings(
  params: GetMeetingsRequest,
): Promise<{ meetings: Meeting[]; nextCursor: MeetingsCursor | null; hasMore: boolean }> {
  const user = await requireUser();
  const limit = params.limit ?? 20;

  let query = supabase
    .from('meetings')
    .select('*')
    .eq('region2', params.region2)
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

  const meetingsBase = pageRows.map(toMeeting);
  const favoriteIds = await getFavoriteIdSet(
    user.id,
    meetingsBase.map((m) => m.id),
  );

  const meetings = meetingsBase.map((meeting) => ({
    ...meeting,
    isFavorite: favoriteIds.has(meeting.id),
  }));

  const lastRow = pageRows[pageRows.length - 1];
  const nextCursor = lastRow != null ? { createdAt: lastRow.created_at, id: lastRow.id } : null;

  return { meetings, nextCursor, hasMore };
}

export async function getMeetingById(id: string): Promise<Meeting> {
  const user = await requireUser();

  const { data, error } = await supabase.from('meetings').select('*').eq('id', id).single();
  if (error) throw error;

  const meeting = toMeeting(data);
  const favoriteIds = await getFavoriteIdSet(user.id, [id]);

  return { ...meeting, isFavorite: favoriteIds.has(id) };
}

export async function setMeetingFavorite(params: SetMeetingFavoriteRequest): Promise<void> {
  const user = await requireUser();
  const { meetingId, isFavorite } = params;

  if (isFavorite) {
    const { error } = await supabase.from('meeting_favorites').upsert({
      user_id: user.id,
      meeting_id: meetingId,
    });
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('meeting_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('meeting_id', meetingId);

  if (error) throw error;
}
