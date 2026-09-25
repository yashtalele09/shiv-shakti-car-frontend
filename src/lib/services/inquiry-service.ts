import { authInstance, instance } from '../../axios';
import type {
  InquiryPayloadT,
  InquiryResponseT,
  InquiryListResponseT,
  SendOtpPayloadT,
  VerifyOtpPayloadT,
  VerifyOtpResponseT,
  SendOtpResponseT,
} from '../../typs/inquiry';

const inquiryService = {
  addInquiry: async (data: InquiryPayloadT): Promise<InquiryResponseT> => {
    const response = await authInstance.post('/inquiry/create-inquiry', data);
    return response.data;
  },

  getInquiry: async (): Promise<InquiryListResponseT> => {
    const response = await authInstance.get('/inquiry/get-inquiry');
    return response.data;
  },

  sendOtp: async (payload: SendOtpPayloadT): Promise<SendOtpResponseT> => {
    const { data } = await instance.post('/inquiry/send-otp', payload);
    return data;
  },

  verifyOtp: async (
    payload: VerifyOtpPayloadT
  ): Promise<VerifyOtpResponseT> => {
    const { data } = await instance.post('/inquiry/verify-otp', payload);
    return data;
  },
};
export default inquiryService;
