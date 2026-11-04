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

export function createAvatar(id: number, name: string, imagePath: string | null): AvatarData {
  return {
    initials: getInitials(name),
    color: (id % AVATAR_COLORS_COUNT) + 1,
    imageUrl: imagePath ? `${RESOURCES_URL}${imagePath}` : '',
  };
}
