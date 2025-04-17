import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from 'core/axios';
import { useLocation, useNavigate } from 'react-router';

import { notification } from '../../../core/notification';

export type RequestBodyType = {
  login: string;
  password: string;
};

const auth = {
  login: async (body: RequestBodyType) => await api.post('signin', body),
  register: async (body: RequestBodyType) => await api.post('signup', body),
};

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: auth.login,
    onSuccess: (data: Record<string, any>) => {
      notification.success();
      const userId = data?.data?._id;
      if (!!userId) {
        localStorage.setItem('userId', userId);
        navigate('/parser');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      notification.error({ message });
    },
  });
};
export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: auth.register,
    onSuccess: (data: Record<string, any>) => {
      notification.success();
      const userId = data?.data?._id;
      if (!!userId) {
        localStorage.setItem('userId', userId);
        navigate('/signin');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message;
      notification.error({ message });
    },
  });
};

// const getUsers = async () => {
//   const res = await api.get('users');
//   return res;
// };
//
// const login = async (body: RequestBodyType) => {
//   const res = await api.post('signin', body);
//   return res;
// };
//
// export const useUsers = () =>
//   useQuery({
//     queryKey: ['users'],
//     queryFn: getUsers,
//   });
