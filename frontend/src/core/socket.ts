import { io } from 'socket.io-client';

const userId = localStorage.getItem('userId');

export const socket = io('http://localhost:4000', {
  path: '/socket.io', // Путь, который настроен на сервере
  auth: {
    userId: userId, // Передаем userId в handshake
  },
  autoConnect: false, // Не подключать автоматически, чтобы контролировать подключение
});
