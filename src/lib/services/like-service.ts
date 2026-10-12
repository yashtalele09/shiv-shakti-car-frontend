import { authInstance } from '../../axios';
import type {
  GetBulkLikesInputT,
  GetLikeStatusInputT,
  ToggleLikeInputT,
} from '../../typs/like/like';

const likeService = {
  toggleLike: async (data: ToggleLikeInputT) => {
    const response = await authInstance.post(
      '/like/toggle-like',
      {},
      { params: { vehicleId: data.vehicleId } }
    );
    return response.data;
  },

  getLikeStatus: async (data: GetLikeStatusInputT) => {
    const response = await authInstance.get('/like/get-like', {
      params: { vehicleId: data.vehicleId },
    });
    return response.data;
  },

  getBulkLikes: async (data: GetBulkLikesInputT) => {
    const response = await authInstance.get('/like/get-bulk-likes', {
      params: { ids: data.vehicleIds.join(',') },
    });
    return response.data;
  },

  getMyLikes: async () => {
    const response = await authInstance.get('/like/my-likes');
    return response.data;
  },
};

export default likeService;
