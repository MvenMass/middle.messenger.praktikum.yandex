import type { AvatarData } from './avatar';

export interface UserName {
  firstName: string;
  secondName: string;
  displayName: string;
}

export interface UserContacts {
  login: string;
  email: string;
  phone: string;
}

export type UserProfile = UserName & UserContacts & AvatarData;
