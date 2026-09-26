export interface BannerSlideT {
  imageUrl: string;
  imagePublicId?: string;
  title: string;
  subtitle: string;
}

export interface GetBannerResponse {
  success: boolean;
  data: BannerSlideT[];
}
