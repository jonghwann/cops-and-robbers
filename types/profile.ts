export type Gender = 'male' | 'female';

export interface Address {
  region1: string;
  region2: string;
  region3: string;
  hCode: string;
}

export interface Profile extends Address {
  name: string;
  gender: Gender;
  birthDate: string;
  avatarUrl?: string;
}
