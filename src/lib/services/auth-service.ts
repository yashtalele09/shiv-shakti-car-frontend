import type {
  SignUpAPIInputT,
  SignUpAPISuccessResponseT,
} from "../../typs/auth/sign-up/post";
import { authInstance } from "../../axios";
import type {
  SignInAPIInputT,
  SignInAPISuccessResponseT,
} from "../../typs/auth/sign-in/post";

const authService = {
  signUp: async (data: SignUpAPIInputT): Promise<SignUpAPISuccessResponseT> => {
    const response = await authInstance.post("auth/register", data);
    return response.data;
  },

  signIn: async (data: SignInAPIInputT): Promise<SignInAPISuccessResponseT> => {
    const response = await authInstance.post("auth/login", data);
    return response.data;
  },

  googleAuth: async (idToken: string): Promise<SignUpAPISuccessResponseT> => {
    const response = await authInstance.post("auth/firebase", {
      idToken: idToken,
    });
    return response.data;
  },
};

export default authService;
