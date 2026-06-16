import { environment } from '../../../environments/environment';

export function normalizeImageUrl(image: string | undefined | null): string {
  if (!image) {
    return '';
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  const apiRoot = environment.apiUrl.replace(/\/api\/?$/, '');

  if (image.startsWith('/api/uploads/') || image.startsWith('api/uploads/')) {
    return `${apiRoot}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  return image;
}
