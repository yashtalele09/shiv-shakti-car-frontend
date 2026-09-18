export type InquiryPayloadT = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type InquiryResponseT = {
  success: boolean;
  message: string;
  data: {
    inquiryId: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type InquiryListResponseT = {
  success: boolean;
  message: string;
  data: InquiryResponseT['data'][];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
};
