import axios from 'axios';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true
  });

export default httpClient;