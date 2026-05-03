import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/auth/me');
      const userData = res.data.data.user;
      
      set({ user: userData, loading: false });
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}));

export default useAuthStore;
