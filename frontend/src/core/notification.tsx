import { notifications as baseNotifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

const xIcon = <IconX size={20} />;
const checkIcon = <IconCheck size={20} />;

type NotificationProps = {
  title?: string;
  message?: string;
};

export const notification = {
  success: (props?: NotificationProps) => {
    baseNotifications.show({
      title: props?.title || 'Выполнено',
      message: props?.message || '',
      icon: checkIcon,
      color: 'green',
      autoClose: 3000,
      style: { width: 500 },
      position: 'top-right',
    });
  },
  error: (props?: NotificationProps) => {
    baseNotifications.show({
      title: props?.title || 'Ошибка',
      message: props?.message || '',
      icon: xIcon,
      color: 'red',
      autoClose: 3000,
      style: { width: 500 },
      position: 'top-right',
    });
  },
};
