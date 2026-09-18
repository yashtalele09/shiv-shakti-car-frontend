import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
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
      toast.success(response.message || 'Inquiry submitted successfully');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        'Failed to submit inquiry. Please try again.';
      toast.error(message);
    },
  });
};
