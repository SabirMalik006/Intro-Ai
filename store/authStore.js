import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
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

  updateProfile: async (data) => {
    try {
      const res = await api.put('/auth/update-profile', data);
      const userData = res.data.data.user;
      
      set({ user: userData });
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, message: res.data.message, user: userData };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      const res = await api.put('/auth/update-password', { currentPassword, newPassword });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update password' };
    }
  },

  deleteAccount: async (password) => {
    try {
      const res = await api.delete('/auth/delete-account', { data: { password } });
      localStorage.removeItem('user');
      set({ user: null });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to delete account' };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}));

export default useAuthStore;
