export interface UserName {
  first_name: string;
  second_name: string;
  display_name: string | null;
}

export interface UserContacts {
  login: string;
  email: string;
  phone: string;
}

export interface User extends UserName, UserContacts {
  id: number;
  avatar: string | null;
}

export type SignInData = {
  login: string;
  password: string;
};

export type SignUpData = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  phone: string;
  password: string;
};

export type ProfileData = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
};

export type PasswordData = {
  oldPassword: string;
  newPassword: string;
};

export type UserSearchData = {
  login: string;
};
