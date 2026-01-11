import { supabase } from '@/lib/supabase';
import type { SignUpRequest, UpdateProfileRequest, VerifyOtpRequest } from './types';

export async function signInWithOtp(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) throw error;
  return data;
}

export async function verifyOtp({ phone, code }: VerifyOtpRequest) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: 'sms',
  });

  if (error) throw error;
  return data;
}

export async function getProfile() {
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

export async function signUp(params: SignUpRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error();

  if (!Object.values(params).every(Boolean)) throw new Error();

  const { data, error } = await supabase.from('profiles').upsert({
    id: user.id,
    ...params,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error();

  return data;
}

export async function updateProfile(params: UpdateProfileRequest) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error();

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...params,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) throw error;
  return data;
}
