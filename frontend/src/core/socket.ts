import { io } from 'socket.io-client';

const userId = localStorage.getItem('userId');

export const socket = io('http://localhost:4000', {
  path: '/socket.io', // Путь, который настроен на сервере
  auth: {
    userId: userId, // Передаем userId в handshake
  },
  autoConnect: false, // Не подключать автоматически, чтобы контролировать подключение
});

export const SOCKET_ENUMS = {
  PARSING_START: 'PARSING_START',
  PARSING_STATE: 'PARSING_STATE',
  PARSING_RESULT: 'PARSING_RESULT',

  STATUS_SAVE_BOOKS: 'STATUS_SAVE_BOOKS',
  STATUS_UPDATE: 'STATUS_UPDATE',
} as const;
