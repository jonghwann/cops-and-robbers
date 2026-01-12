import { supabase } from '@/lib/supabase';
import type { Meeting } from '@/types/meeting';

export async function getMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;

  return (data ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    thumbnailUrl: m.thumbnail_url,
    region2: m.region2,
    memberCount: m.member_count,
    createdAt: m.created_at,
  }));
}
