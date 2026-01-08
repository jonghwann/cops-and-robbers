import type { Gender } from '@/types/user';

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface SignUpRequest {
  name: string;
  gender: Gender;
  birthDate: Date;
  region1: string;
  region2: string;
  region3: string;
  hCode: string;
}
