import { defineStore } from 'pinia';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    async login(username, password) {
      const res = await axios.post(
        `${baseURL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      this.accessToken = res.data.accessToken;
      this.user = res.data.user;
      return res.data;
    },

    async register(username, password, full_name) {
      const res = await axios.post(
        `${baseURL}/auth/register`,
        { username, password, full_name },
        { withCredentials: true }
      );
      return res.data;
    },

    async refreshAccessToken() {
      const res = await axios.post(
        `${baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      this.accessToken = res.data.accessToken;
      return this.accessToken;
    },

    async fetchMe() {
      const res = await axios.get(`${baseURL}/auth/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
      this.user = res.data;
      return this.user;
    },

    async logout() {
      try {
        await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });
      } catch (e) {
        // ignore
      }
      this.accessToken = null;
      this.user = null;
    },
  },
});