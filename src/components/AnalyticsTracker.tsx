import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrackAnalyticsMutation } from '../hooks/useAnalyticsMutation';
import { getSessionId } from '../utils/session';

const AnalyticsTracker = () => {
  const location = useLocation();

  const { mutate } = useTrackAnalyticsMutation();

  useEffect(() => {
    mutate({
      sessionId: getSessionId(),
      eventType: 'page_view',
      page: location.pathname,
    });
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
