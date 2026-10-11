import { instance } from '../../axios';
import { getSessionId } from '../../utils/session'; // adjust to where your function lives
import type {
  GetBulkLikesInputT,
  GetLikeStatusInputT,
  ToggleLikeInputT,
} from '../../typs/like/like';

const guestHeaders = () => ({ 'x-guest-id': getSessionId() });

const likeService = {
  toggleLike: async (data: ToggleLikeInputT) => {
    const response = await instance.post(
      '/like/toggle-like',
      {},
      {
        params: { vehicleId: data.vehicleId },
        headers: guestHeaders(),
      }
    );
    return response.data;
  },

  getLikeStatus: async (data: GetLikeStatusInputT) => {
    const response = await instance.get('/like/get-like', {
      params: { vehicleId: data.vehicleId },
      headers: guestHeaders(),
    });
    return response.data;
  },

  getBulkLikes: async (data: GetBulkLikesInputT) => {
    const response = await instance.get('/like/get-bulk-likes', {
      params: { ids: data.vehicleIds.join(',') },
      headers: guestHeaders(),
    });
    return response.data;
  },

  getMyLikes: async () => {
    const response = await instance.get('/like/my-likes', {
      headers: guestHeaders(),
    });
    return response.data;
  },
};

export default likeService;
