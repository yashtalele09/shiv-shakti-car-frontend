import { useMutation } from '@tanstack/react-query';
import { showToast } from '../../../utils/toast';
import { AxiosError } from 'axios';
import inquiryService from '../../../lib/services/inquiry-service';
import type { APIFailureData } from '../../../typs/shared';
import type { InquiryPayloadT, InquiryResponseT } from '../../../typs/inquiry';

export const useSubmitInquiry = () => {
  return useMutation<
    InquiryResponseT,
    AxiosError<APIFailureData>,
    InquiryPayloadT
  >({
    mutationFn: inquiryService.addInquiry,
    onSuccess: (response) => {
      showToast.success(response.message || 'Inquiry submitted successfully');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to submit inquiry. Please try again.';
      showToast.error(message);
    },
  });
};
