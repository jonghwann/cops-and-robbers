import type { Profile } from '@/types/profile';

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface SignUpRequest extends Omit<Profile, 'birthDate' | 'hCode'> {
  birth_date: string;
  h_code: string;
}

export interface UpdateProfileRequest extends Omit<Partial<Profile>, 'birthDate' | 'hCode'> {
  birth_date?: string;
  h_code?: string;
}
