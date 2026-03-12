import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import type {
  SignUpAPIInputT,
  SignUpAPISuccessResponseT,
} from "../../../../typs/auth/sign-up/post";
import authService from "../../../../lib/services/auth-service";
import type { APIFailureData } from "../../../../typs/shared";

type UseSignUpMutationOptions = {
  onSuccess?: (data: SignUpAPISuccessResponseT) => void;
  onError?: (error: APIFailureData) => void;
};

export const useSignUpMutation = (options?: UseSignUpMutationOptions) => {
  return useMutation({
    mutationFn: ({ data }: { data: SignUpAPIInputT }) =>
      authService.signUp(data),
    onSuccess: (data: SignUpAPISuccessResponseT) => {
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
