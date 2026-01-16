import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/profile';
import type { SignUpRequest, UpdateProfileRequest, VerifyOtpRequest } from './types';

export async function signInWithOtp(phone: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) throw error;
}

export async function verifyOtp({ phone, code }: VerifyOtpRequest): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms',
  });

  if (error) throw error;
}

export async function getProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { id, birth_date, h_code, avatar_url, ...rest } = data;
  return { ...rest, id, birthDate: birth_date, hCode: h_code, avatarUrl: avatar_url };
}

export async function signUp(params: SignUpRequest): Promise<void> {
  const user = await requireUser();

  if (!Object.values(params).every(Boolean)) throw new Error();

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...params,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function updateProfile(params: UpdateProfileRequest): Promise<void> {
  const user = await requireUser();

  const { error } = await supabase
    .from('profiles')
    .update({
      ...params,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
}

export async function uploadProfileAvatar(imageUri: string): Promise<string> {
  const user = await requireUser();
  const path = `avatars/${user.id}/avatar.jpg`;

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: 'base64',
  });

  const arrayBuffer = decode(base64);

  const { error } = await supabase.storage.from('profile-avatars').upload(path, arrayBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('profile-avatars').getPublicUrl(path);
  return data.publicUrl;
}
