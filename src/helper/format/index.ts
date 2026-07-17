
export const formatPrice = (price: number): string => {
  if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatKm = (km: number): string => `${km.toLocaleString('en-IN')} km`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const isVideoUrl = (url: string): boolean => {
  const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.avi'];
  const lower = url.toLowerCase().split('?')[0];
  return videoExts.some((ext) => lower.endsWith(ext));
};