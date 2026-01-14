import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Meeting } from '@/types/meeting';
import type {
  CreateMeetingRequest,
  GetMeetingsRequest,
  MeetingsCursor,
  SetMeetingFavoriteRequest,
} from './type';

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

export async function createMeeting(params: CreateMeetingRequest): Promise<Meeting> {
  const user = await requireUser();

  if (!Object.values(params).every(Boolean)) throw new Error();

  const { region2, imageUri, title, description } = params;

  const fileId = `${user.id}-${Date.now()}`;
  const imageUrl = await uploadMeetingThumbnail(fileId, imageUri);

  const { data, error } = await supabase
    .from('meetings')
    .insert({
      host_id: user.id,
      thumbnail_url: imageUrl,
      region2,
      title,
      description,
      member_count: 1,
    })
    .select('*')
    .single();

  if (error) throw new Error();

  return { ...toMeeting(data), isFavorite: false };
}

export async function uploadMeetingThumbnail(fileId: string, imageUri: string): Promise<string> {
  const user = await requireUser();
  const path = `meetings/${user.id}/${fileId}.jpg`;

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: 'base64',
  });

  const arrayBuffer = decode(base64);

  const { error } = await supabase.storage.from('meeting-thumbnails').upload(path, arrayBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from('meeting-thumbnails').getPublicUrl(path);
  return urlData.publicUrl;
}

export async function getSavedMeetings(): Promise<Meeting[]> {
  const user = await requireUser();

  const { data: favRows, error: favError } = await supabase
    .from('meeting_favorites')
    .select('meeting_id')
    .eq('user_id', user.id);

  if (favError) throw favError;

  const ids = (favRows ?? []).map((r) => r.meeting_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase.from('meetings').select('*').in('id', ids);
  if (error) throw error;

  const meetings = (data ?? []).map(toMeeting).map((m) => ({ ...m, isFavorite: true }));

  const order = new Map(ids.map((id, i) => [id, i]));
  meetings.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return meetings;
}
