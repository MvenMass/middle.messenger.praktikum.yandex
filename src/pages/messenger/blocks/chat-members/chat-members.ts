import { chatController } from '../../../../controllers/chat-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import type { AvatarData } from '../../../../models/avatar';
import { createAvatar } from '../../../../services/avatar';
import { getErrorMessage } from '../../../../services/error-message';
import { connect } from '../../../../store/connect';
import type { AppState } from '../../../../store/store';
import template from './chat-members.hbs?raw';
import './chat-members.scss';

interface MemberView {
  id: number;
  name: string;
  login: string;
  avatar: AvatarData;
  isCurrentUser: boolean;
}

interface ChatMembersProps extends BlockProps {
  members: MemberView[];
  error: string;
}

function mapMembersToProps(state: AppState): Partial<ChatMembersProps> {
  return {
    error: '',
    members: state.chatUsers.map((user) => {
      const name = `${user.first_name} ${user.second_name}`;

      return {
        id: user.id,
        name,
        login: user.login,
        avatar: createAvatar(user.id, name, user.avatar),
        isCurrentUser: user.id === state.user?.id,
      };
    }),
  };
}

class ChatMembers extends Block<ChatMembersProps> {
  constructor() {
    super({ members: [], error: '' });
  }

  protected getEvents(): BlockEvents {
    return {
      click: (event) => this.handleClick(event),
    };
  }

  protected render(): string {
    return template;
  }

  private async handleClick(event: Event): Promise<void> {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-user-id]') : null;

    if (!button) {
      return;
    }

    try {
      await chatController.removeUser(Number(button.dataset.userId));
    } catch (error) {
      this.setProps({ error: getErrorMessage(error) });
    }
  }
}

const ConnectedChatMembers = connect(mapMembersToProps)(ChatMembers);

export { ConnectedChatMembers as ChatMembers };
