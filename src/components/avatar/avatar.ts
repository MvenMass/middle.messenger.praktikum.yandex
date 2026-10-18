import { Block, type BlockProps } from '../../core/block';
import type { AvatarData } from '../../models/avatar';
import template from './avatar.hbs?raw';
import './avatar.scss';

interface AvatarProps extends BlockProps, AvatarData {
  size: 'small' | 'medium' | 'large';
}

export class Avatar extends Block<AvatarProps> {
  protected render(): string {
    return template;
  }
}
