import axios from 'axios';
import Swal from 'sweetalert2';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use((res) => res.data);

instance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    const token = localStorage.getItem('token');
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return newConfig;
  },
  (error) => Promise.reject(error)
);

const updateToken = async (): Promise<void> => {
  const refreshToken = localStorage.getItem('refreshToken');

  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
  if (refreshToken) {
    try {
      const response = await axios.post<{ token: string; refreshToken: string }>(`${api.baseURL}/refresh`, {
        refreshToken,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Authorization error',
        footer: error instanceof Error ? error.message : String(error),
      });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.reload();
    }
  } else {
    window.location.reload();
  }
};

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem('token')) {
        await updateToken().catch(() => {
          localStorage.clear();
          window.location.href = '/login';
          throw new Error('Token refresh failed');
        });
      }
    } else if ([403, 404].includes(error.response.status)) {
      throw new Error('Unauthorized or not found token');
    }
    return Promise.reject(error);
  }
);

export default instance;
