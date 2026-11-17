import { Button, Form, FormField, Modal } from '../../components';
import { chatController } from '../../controllers/chat-controller';
import { messageController } from '../../controllers/message-controller';
import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import type { AvatarData } from '../../models/avatar';
import { createAvatar } from '../../services/avatar';
import type { FormValues } from '../../services/form-values';
import { connect } from '../../store/connect';
import type { AppState } from '../../store/store';
import { ChatAvatarForm } from './blocks/chat-avatar-form';
import { ChatList } from './blocks/chat-list';
import { ChatMembers } from './blocks/chat-members';
import { ChatMenu } from './blocks/chat-menu';
import { Composer } from './blocks/composer';
import { MessageFeed } from './blocks/message-feed';
import { Search } from './blocks/search';
import template from './messenger-page.hbs?raw';
import './messenger-page.scss';
import './sidebar.scss';
import './chat.scss';

interface ActiveChatView {
  id: number;
  title: string;
  avatar: AvatarData;
}

interface ChatModals {
  createChatModal: Modal;
  addUserModal: Modal;
  membersModal: Modal;
  chatAvatarModal: Modal;
  deleteChatModal: Modal;
}

interface MessengerPageProps extends BlockProps, ChatModals {
  activeChat: ActiveChatView | null;
  search: Search;
  chatList: Block;
  chatMenu: ChatMenu;
  messageFeed: Block;
  composer: Composer;
}

interface FormModalOptions {
  title: string;
  fields: FormField[];
  submitText: string;
  onSubmit: (values: FormValues) => Promise<void>;
}

function createFormModal({ title, fields, submitText, onSubmit }: FormModalOptions): Modal {
  const form = new Form({
    fields,
    submitButton: new Button({ text: submitText, type: 'submit' }),
    onSubmit: async (values) => {
      await onSubmit(values);
      modal.close();
    },
  });

  const modal = new Modal({
    title,
    content: form,
    onOpen: () => form.reset(),
  });

  return modal;
}

function createChatAvatarModal(): Modal {
  const avatarForm = new ChatAvatarForm(async (file) => {
    await chatController.updateChatAvatar(file);
    modal.close();
  });

  const modal = new Modal({
    title: 'Аватар чата',
    content: avatarForm,
    onOpen: () => avatarForm.reset(),
  });

  return modal;
}

function createChatModals(search: Search): ChatModals {
  return {
    createChatModal: createFormModal({
      title: 'Новый чат',
      fields: [new FormField({ label: 'Название чата', name: 'title', type: 'text' })],
      submitText: 'Создать',
      onSubmit: async (values) => {
        await chatController.createChat(values);
        search.reset();
      },
    }),
    addUserModal: createFormModal({
      title: 'Добавить пользователя',
      fields: [new FormField({ label: 'Логин', name: 'login', type: 'text' })],
      submitText: 'Добавить',
      onSubmit: (values) => chatController.addUser(values),
    }),
    membersModal: new Modal({
      title: 'Участники чата',
      content: new ChatMembers(),
      onOpen: () => chatController.loadChatUsers(),
    }),
    chatAvatarModal: createChatAvatarModal(),
    deleteChatModal: createFormModal({
      title: 'Удалить чат?',
      fields: [],
      submitText: 'Удалить',
      onSubmit: () => chatController.deleteChat(),
    }),
  };
}

function mapActiveChatToProps(state: AppState): Partial<MessengerPageProps> {
  const chat = state.chats.find((item) => item.id === state.activeChatId);

  return {
    activeChat: chat ? { id: chat.id, title: chat.title, avatar: createAvatar(chat.id, chat.title, chat.avatar) } : null,
  };
}

class MessengerPage extends Block<MessengerPageProps> {
  constructor() {
    const search = new Search();
    const modals = createChatModals(search);

    super({
      ...modals,
      activeChat: null,
      search,
      chatList: new ChatList(),
      messageFeed: new MessageFeed(),
      composer: new Composer(),
      chatMenu: new ChatMenu([
        { text: 'Добавить пользователя', onSelect: () => modals.addUserModal.open() },
        { text: 'Удалить пользователя', onSelect: () => modals.membersModal.open() },
        { text: 'Изменить аватар чата', onSelect: () => modals.chatAvatarModal.open() },
        { text: 'Удалить чат', onSelect: () => modals.deleteChatModal.open(), isDanger: true },
      ]),
    });
  }

  protected componentDidMount(): void {
    chatController.showAllChats();
    chatController.reconnectActiveChat();
  }

  protected componentWillUnmount(): void {
    messageController.disconnect();
  }

  protected getEvents(): BlockEvents {
    return {
      click: (event) => this.handleClick(event),
    };
  }

  protected render(): string {
    return template;
  }

  private handleClick(event: Event): void {
    const actionElement = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-action]') : null;
    const action = actionElement?.dataset.action;

    if (action === 'create-chat') {
      this.props.createChatModal.open();
    }

    if (action === 'close-chat') {
      chatController.closeChat();
    }
  }
}

const ConnectedMessengerPage = connect(mapActiveChatToProps)(MessengerPage);

export { ConnectedMessengerPage as MessengerPage };
