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

  const { birth_date, h_code, ...rest } = data;
  return { ...rest, birthDate: birth_date, hCode: h_code };
}

export async function signUp(params: SignUpRequest): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error();

  if (!Object.values(params).every(Boolean)) throw new Error();

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...params,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function updateProfile(params: UpdateProfileRequest): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error();

  const { error } = await supabase
    .from('profiles')
    .update({
      ...params,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
}
