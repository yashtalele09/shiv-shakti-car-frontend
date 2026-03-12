export type SignInAPIInputT = {
  email: string;
  password: string;
};

export type SignInAPISuccessResponseT = {
  success: true;
  message: string;
  user: userDataT;
  token: string;
};

export type userDataT = {
  provider: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
