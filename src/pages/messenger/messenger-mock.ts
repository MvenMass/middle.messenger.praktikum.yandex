// моковые данные чтобы мессенджер не был пустым. потом заменю на настоящие данные

export const chats = [
  {
    title: 'Антон Антонов',
    initials: 'АА',
    color: 1,
    lastMessage: 'Привет',
    time: '14:20',
    unreadCount: 2,
    isActive: true,
  },
  {
    title: 'Сергей Сергеев',
    initials: 'СС',
    color: 3,
    lastMessage: 'Привкте как дела?',
    time: '13:05',
    unreadCount: 2,
    isActive: false,
  },
  {
    title: 'Михаил Михайлов',
    initials: 'ММ',
    color: 4,
    lastMessage: 'давно не виделись',
    time: '22:00',
    unreadCount: 0,
    isActive: false,
  },
  {
    title: 'Анна',
    initials: 'А',
    color: 7,
    lastMessage: 'Йоу',
    time: 'Вт',
    unreadCount: 0,
    isActive: false,
  },
  {
    title: 'Валерий Валерьянов',
    initials: 'ВВ',
    color: 6,
    lastMessage: 'Ок',
    time: 'Пн',
    unreadCount: 0,
    isActive: false,
  },
];

export const activeChat = {
  title: 'Антон Антонов',
  initials: 'АА',
  color: 1,
  status: 'была в сети 5 минут назад',
};

export const messages = [
  { text: 'Привет!', time: '14:02', isOutgoing: false },
  { text: 'Привет!', time: '14:05', isOutgoing: true },
  { text: 'как дела?', time: '14:06', isOutgoing: false },
  { text: 'пока не родила', time: '14:12', isOutgoing: true },
  { text: 'понятно', time: '14:20', isOutgoing: false },
];
