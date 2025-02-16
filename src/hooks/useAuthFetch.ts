import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useAuthFetch = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };
};