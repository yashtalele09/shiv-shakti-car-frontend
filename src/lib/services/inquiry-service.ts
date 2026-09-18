import { authInstance } from '../../axios';
import type { InquiryPayloadT, InquiryResponseT, InquiryListResponseT } from '../../typs/inquiry';

const inquiryService = {
  addInquiry: async (data: InquiryPayloadT): Promise<InquiryResponseT> => {
    const response = await authInstance.post('/inquiry/create-inquiry', data);
    return response.data;
  },

  getInquiry: async (): Promise<InquiryListResponseT> => {
    const response = await authInstance.get('/inquiry/get-inquiry');
    return response.data;
  },
};
export default inquiryService;
