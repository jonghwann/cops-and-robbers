import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Meeting } from '@/types/meeting';
import type { SetMeetingFavoriteRequest } from './type';

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

export async function getMeetings(region2: string): Promise<Meeting[]> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('region2', region2)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  const meetings = (data ?? []).map(toMeeting);
  const favoriteIds = await getFavoriteIdSet(
    user.id,
    meetings.map((meeting) => meeting.id),
  );

  return meetings.map((meeting) => ({ ...meeting, isFavorite: favoriteIds.has(meeting.id) }));
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
