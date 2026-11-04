import { Button, Form, FormField, Modal } from '../../components';
import { chatController } from '../../controllers/chat-controller';
import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import { createChatView, type ChatView } from '../../services/chat-view';
import type { FormValues } from '../../services/form-values';
import { connect } from '../../store/connect';
import type { AppState } from '../../store/store';
import { ChatMenu } from './blocks/chat-menu';
import { Composer } from './blocks/composer';
import { Search } from './blocks/search';
import template from './messenger-page.hbs?raw';
import './messenger-page.scss';
import './sidebar.scss';
import './chat-preview.scss';
import './chat.scss';

interface MessengerPageProps extends BlockProps {
  chats: ChatView[];
  activeChat: ChatView | null;
  search: Search;
  chatMenu: ChatMenu;
  composer: Composer;
  createChatModal: Modal;
  addUserModal: Modal;
  removeUserModal: Modal;
}

interface FormModalOptions {
  title: string;
  field: FormField;
  submitText: string;
  onSubmit: (values: FormValues) => Promise<void>;
}

function createFormModal({ title, field, submitText, onSubmit }: FormModalOptions): Modal {
  const modal = new Modal({
    title,
    form: new Form({
      fields: [field],
      submitButton: new Button({ text: submitText, type: 'submit' }),
      onSubmit: async (values) => {
        await onSubmit(values);
        modal.close();
      },
    }),
  });

  return modal;
}

function mapChatsToProps(state: AppState): Partial<MessengerPageProps> {
  const chats = state.chats.map((chat) => createChatView(chat, state.activeChatId));

  return {
    chats,
    activeChat: chats.find((chat) => chat.isActive) ?? null,
  };
}

class MessengerPage extends Block<MessengerPageProps> {
  constructor() {
    const addUserModal = createFormModal({
      title: 'Добавить пользователя',
      field: new FormField({ label: 'Логин', name: 'login', type: 'text' }),
      submitText: 'Добавить',
      onSubmit: (values) => chatController.addUser(values),
    });

    const removeUserModal = createFormModal({
      title: 'Удалить пользователя',
      field: new FormField({ label: 'Логин', name: 'login', type: 'text' }),
      submitText: 'Удалить',
      onSubmit: (values) => chatController.removeUser(values),
    });

    super({
      chats: [],
      activeChat: null,
      search: new Search(),
      composer: new Composer(),
      chatMenu: new ChatMenu({
        onAddUser: () => addUserModal.open(),
        onRemoveUser: () => removeUserModal.open(),
      }),
      createChatModal: createFormModal({
        title: 'Новый чат',
        field: new FormField({ label: 'Название чата', name: 'title', type: 'text' }),
        submitText: 'Создать',
        onSubmit: (values) => chatController.createChat(values),
      }),
      addUserModal,
      removeUserModal,
    });
  }

  protected componentDidMount(): void {
    chatController.loadChats();
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
    if (!(event.target instanceof Element)) {
      return;
    }

    const chatPreview = event.target.closest<HTMLElement>('[data-chat-id]');
    const createChatButton = event.target.closest('[data-action="create-chat"]');

    if (chatPreview) {
      chatController.selectChat(Number(chatPreview.dataset.chatId));
    }

    if (createChatButton) {
      this.props.createChatModal.open();
    }
  }
}

const ConnectedMessengerPage = connect(mapChatsToProps)(MessengerPage);

export { ConnectedMessengerPage as MessengerPage };
