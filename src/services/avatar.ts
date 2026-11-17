import { RESOURCES_URL } from '../api/http';
import type { AvatarData } from '../models/avatar';

const AVATAR_COLORS_COUNT = 7;

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

function getImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return '';
  }

  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  const relativePath = imagePath.replace(/^\/?resources/, '');
  const separator = relativePath.startsWith('/') ? '' : '/';

  return `${RESOURCES_URL}${separator}${relativePath}`;
}

export function createAvatar(id: number, name: string, imagePath: string | null): AvatarData {
  return {
    initials: getInitials(name),
    color: (id % AVATAR_COLORS_COUNT) + 1,
    imageUrl: getImageUrl(imagePath),
  };
}
