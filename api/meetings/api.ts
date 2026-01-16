import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Meeting } from '@/types/meeting';
import type {
  CreateMeetingRequest,
  GetMeetingsRequest,
  MeetingMember,
  MeetingsCursor,
  SetMeetingFavoriteRequest,
  UpdateMeetingRequest,
} from './type';

function toMeeting(row: any): Omit<Meeting, 'isFavorite'> {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
    region2: row.region2,
    memberCount: row.meeting_members?.[0]?.count ?? 0,
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

async function getJoinedIdSet(userId: string, meetingIds: string[]) {
  if (meetingIds.length === 0) return new Set<string>();

  const { data, error } = await supabase
    .from('meeting_members')
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
    .select('*, meeting_members(count)')
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

  const joinedIds = await getJoinedIdSet(
    user.id,
    meetingsBase.map((meeting) => meeting.id),
  );

  const meetings = meetingsBase.map((meeting, idx) => ({
    ...meeting,
    isFavorite: favoriteIds.has(meeting.id),
    isJoined: joinedIds.has(meeting.id) || pageRows[idx].host_id === user.id,
  }));

  const lastRow = pageRows[pageRows.length - 1];
  const nextCursor = lastRow != null ? { createdAt: lastRow.created_at, id: lastRow.id } : null;

  return { meetings, nextCursor, hasMore };
}

export async function getMeetingById(id: string): Promise<Meeting> {
  const user = await requireUser();

  const { data, error } = await supabase
    .from('meetings')
    .select('*, meeting_members(count)')
    .eq('id', id)
    .single();
  if (error) throw error;

  const meeting = toMeeting(data);
  const memberCount = data.meeting_members?.[0]?.count ?? 0;

  const joinedIds = await getJoinedIdSet(user.id, [id]);
  const favoriteIds = await getFavoriteIdSet(user.id, [id]);

  const isHost = data.host_id === user.id;

  return {
    ...meeting,
    memberCount,
    isFavorite: favoriteIds.has(id),
    isJoined: isHost || joinedIds.has(id),
  };
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
    })
    .select('*, meeting_members(count)')
    .single();

  if (error) throw new Error();

  const { error: memberErr } = await supabase.from('meeting_members').insert({
    meeting_id: data.id,
    user_id: user.id,
  });
  if (memberErr) throw memberErr;

  return { ...toMeeting(data), isFavorite: false, isJoined: true };
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

  const ids = (favRows ?? []).map((row) => row.meeting_id);
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('meetings')
    .select('*, meeting_members(count)')
    .in('id', ids);
  if (error) throw error;

  const joinedIds = await getJoinedIdSet(user.id, ids);

  const meetings = (data ?? []).map((row: any) => {
    const m = toMeeting(row);
    const isHost = row.host_id === user.id;

    return {
      ...m,
      isFavorite: true,
      isJoined: isHost || joinedIds.has(m.id),
    };
  });

  const order = new Map(ids.map((id, i) => [id, i]));
  meetings.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  return meetings;
}

export async function joinMeeting(meetingId: string): Promise<void> {
  const user = await requireUser();

  const { error } = await supabase.from('meeting_members').insert({
    meeting_id: meetingId,
    user_id: user.id,
  });

  if (error) throw error;
}

export async function getMyMeetings(): Promise<Meeting[]> {
  const user = await requireUser();

  const { data: memberRows, error: memberError } = await supabase
    .from('meeting_members')
    .select('meeting_id')
    .eq('user_id', user.id);

  if (memberError) throw memberError;

  const memberIds = (memberRows ?? []).map((row) => row.meeting_id);

  let query = supabase
    .from('meetings')
    .select('*, meeting_members(count)')
    .order('created_at', { ascending: false });

  if (memberIds.length > 0) {
    query = query.or(`host_id.eq.${user.id},id.in.(${memberIds.join(',')})`);
  } else {
    query = query.eq('host_id', user.id);
  }

  const { data, error } = await query;
  if (error) throw error;

  const meetingsBase = (data ?? []).map(toMeeting);

  const favoriteIds = await getFavoriteIdSet(
    user.id,
    meetingsBase.map((meeting) => meeting.id),
  );

  const memberIdSet = new Set(memberIds);

  return (data ?? []).map((row) => {
    const meeting = toMeeting(row);
    const isHost = row.host_id === user.id;

    return {
      ...meeting,
      isFavorite: favoriteIds.has(meeting.id),
      isJoined: isHost || memberIdSet.has(meeting.id),
    };
  });
}

export async function getMeetingMembers(meetingId: string): Promise<MeetingMember[]> {
  await requireUser();

  const { data, error } = await supabase
    .from('meeting_members')
    .select('user_id, profiles(name, avatar_url)')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    userId: row.user_id,
    name: row.profiles?.name ?? '',
    avatarUrl: row.profiles?.avatar_url ?? null,
  }));
}

export async function updateMeeting(params: UpdateMeetingRequest): Promise<Meeting> {
  const user = await requireUser();

  const title = params.title?.trim();
  const description = params.description?.trim();
  if (!params.meetingId || !title || !description) {
    throw new Error('필수값이 누락되었습니다.');
  }

  let thumbnailUrl: string | undefined;

  if (params.imageUri) {
    const fileId = `${user.id}-${Date.now()}`;
    thumbnailUrl = await uploadMeetingThumbnail(fileId, params.imageUri);
  }

  const payload: Record<string, any> = {
    title,
    description,
  };
  if (thumbnailUrl) payload.thumbnail_url = thumbnailUrl;

  const { error: updateError } = await supabase
    .from('meetings')
    .update(payload)
    .eq('id', params.meetingId)
    .eq('host_id', user.id);

  if (updateError) throw updateError;

  const { data, error: selectError } = await supabase
    .from('meetings')
    .select('*, meeting_members(count)')
    .eq('id', params.meetingId)
    .single();

  if (selectError) throw selectError;

  const base = toMeeting(data);

  const favoriteIds = await getFavoriteIdSet(user.id, [params.meetingId]);
  const joinedIds = await getJoinedIdSet(user.id, [params.meetingId]);
  const isHost = data.host_id === user.id;

  return {
    ...base,
    isFavorite: favoriteIds.has(params.meetingId),
    isJoined: isHost || joinedIds.has(params.meetingId),
  };
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  const user = await requireUser();

  const { error: deleteError } = await supabase
    .from('meetings')
    .delete()
    .eq('id', meetingId)
    .eq('host_id', user.id);

  if (deleteError) throw deleteError;

  const { data: stillExists, error: checkError } = await supabase
    .from('meetings')
    .select('id')
    .eq('id', meetingId)
    .maybeSingle();

  if (checkError) throw checkError;
  if (stillExists) throw new Error('모임을 삭제할 권한이 없습니다.');
}
