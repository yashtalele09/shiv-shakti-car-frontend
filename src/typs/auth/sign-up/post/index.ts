export type SignUpAPIInputT = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type SignUpAPIErrorResponseT = {
  success: false;
  error: string;
};

export type SignUpAPISuccessResponseT = {
  success: true;
  message: string;
  token: string;
  user: UserT;
};

export type UserT = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
};
