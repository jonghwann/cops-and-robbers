import type { Profile } from '@/types/profile';

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface SignUpRequest extends Omit<Profile, 'id' | 'birthDate' | 'hCode'> {
  birth_date: string;
  h_code: string;
}

export interface UpdateProfileRequest
  extends Omit<Partial<Profile>, 'birthDate' | 'hCode' | 'avatarUrl'> {
  birth_date?: string;
  h_code?: string;
  avatar_url?: string;
}
