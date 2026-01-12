import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Meeting } from '@/types/meeting';
import type { SetMeetingFavoriteRequest } from './type';

export async function getMeetings(): Promise<Meeting[]> {
  const user = await requireUser();

  const { data: rawMeetings, error } = await supabase
    .from('meetings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  const meetings = (rawMeetings ?? []).map((meeting) => ({
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    thumbnailUrl: meeting.thumbnail_url,
    region2: meeting.region2,
    memberCount: meeting.member_count,
    createdAt: meeting.created_at,
  }));

  if (meetings.length === 0) return [];

  const meetingIds = meetings.map((meeting) => meeting.id);

  const { data: rawFavorites, error: favoriteError } = await supabase
    .from('meeting_favorites')
    .select('meeting_id')
    .eq('user_id', user.id)
    .in('meeting_id', meetingIds);

  if (favoriteError) throw favoriteError;

  const favoriteMeetingIds = new Set((rawFavorites ?? []).map((favorite) => favorite.meeting_id));

  return meetings.map((meeting) => ({
    ...meeting,
    isFavorite: favoriteMeetingIds.has(meeting.id),
  }));
}

export async function getMeetingById(id: string): Promise<Meeting> {
  const { data, error } = await supabase.from('meetings').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
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
