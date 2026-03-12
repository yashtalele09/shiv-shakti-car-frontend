import { useMutation } from "@tanstack/react-query";
import authService from "../lib/services/auth-service";
import type { APIFailureData } from "../typs/shared/index";
import type { SignUpAPISuccessResponseT } from "../typs/auth/sign-up/post";

type UseGoogleSignInOptions = {
  onSuccess?: (data: SignUpAPISuccessResponseT) => void;
  onError?: (error: APIFailureData) => void;
};

export const useGoogleSignInMutation = (options?: UseGoogleSignInOptions) => {
  return useMutation<
    SignUpAPISuccessResponseT,
    APIFailureData,
    { idToken: string }
  >({
    mutationFn: ({ idToken }) => authService.googleAuth(idToken),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
