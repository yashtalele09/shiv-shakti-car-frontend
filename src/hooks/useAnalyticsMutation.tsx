import { useMutation } from '@tanstack/react-query';
import analyticsService from '../lib/services/analytic-service';
import type { APIFailureData } from '../typs/shared';

type AnalyticsPayload = {
  sessionId: string;
  eventType: string;
  page?: string;
  vehicleId?: string;
  userId?: string;
};

type UseTrackAnalyticsOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: APIFailureData) => void;
};

export const useTrackAnalyticsMutation = (
  options?: UseTrackAnalyticsOptions
) => {
  return useMutation<any, APIFailureData, AnalyticsPayload>({
    mutationFn: (payload) => analyticsService.trackAnalytics(payload),

    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
