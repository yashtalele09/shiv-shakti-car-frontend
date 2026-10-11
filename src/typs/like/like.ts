export type LikeStateT = {
  liked: boolean;
  likesCount: number;
};

export type ToggleLikeInputT = {
  vehicleId: string;
};

export type GetLikeStatusInputT = {
  vehicleId: string;
};

export type GetBulkLikesInputT = {
  vehicleIds: string[];
};

export type ToggleLikeResponseT = {
  success: boolean;
  data: LikeStateT;
};

export type GetBulkLikesResponseT = {
  success: boolean;
  data: Record<string, LikeStateT>;
};

export type GetMyLikesResponseT = {
  success: boolean;
  data: { vehicleIds: string[] };
};
