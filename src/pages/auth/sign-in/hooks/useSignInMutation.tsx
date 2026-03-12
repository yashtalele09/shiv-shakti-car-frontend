import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import type {
  SignInAPIInputT,
  SignInAPISuccessResponseT,
} from "../../../../typs/auth/sign-in/post";
import authService from "../../../../lib/services/auth-service";
import type { APIFailureData } from "../../../../typs/shared";

type UseSignUpMutationOptions = {
  onSuccess?: (data: SignInAPISuccessResponseT) => void;
  onError?: (error: APIFailureData) => void;
};

export const useSignInMutation = (options?: UseSignUpMutationOptions) => {
  return useMutation({
    mutationFn: ({ data }: { data: SignInAPIInputT }) =>
      authService.signIn(data),
    onSuccess: (data: SignInAPISuccessResponseT) => {
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<APIFailureData>) => {
      options?.onError?.({
        error: error.response?.data?.error || "Something went wrong",
        message: error.response?.data?.message || "Something went wrong",
      });
    },
  });
};
