import { instance } from '../../axios';
import type { GetBannerResponse } from '../../typs/banner/get';

const bannerService = {
  getBanner: async (): Promise<GetBannerResponse> => {
    const response = await instance.get('/banner/get-banner');
    return response.data;
  },
};

export default bannerService;
