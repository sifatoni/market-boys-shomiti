import api from '@/lib/api';
import { setToken, removeToken, getUser } from '@/lib/auth';

export const authService = {
  async login(email: string, pass: string) {
    const response = await api.post('/auth/login', { email, pass });
    const { access_token } = response.data;
    setToken(access_token);
    return getUser();
  },

  logout() {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  getMe() {
    return getUser();
  },
};

export default authService;
