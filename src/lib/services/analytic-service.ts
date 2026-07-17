import { instance } from '../../axios';

const trackAnalytics = async (payload: {
  sessionId: string;
  eventType: string;
  page?: string;
  vehicleId?: string;
  userId?: string;
}) => {
  const response = await instance.post('/analytics/user-analytics', payload);

  return response.data;
};

const analyticsService = {
  trackAnalytics,
};

export default analyticsService;
