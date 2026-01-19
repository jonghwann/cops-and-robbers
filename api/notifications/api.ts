import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function registerPushToken(expoPushToken: string): Promise<void> {
  const user = await requireUser();

  const { error } = await supabase.from('push_tokens').upsert(
    {
      user_id: user.id,
      expo_push_token: expoPushToken,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    },
  );

  if (error) throw error;
}

export async function removePushToken(): Promise<void> {
  const user = await requireUser();

  const { error } = await supabase.from('push_tokens').delete().eq('user_id', user.id);

  if (error) throw error;
}
