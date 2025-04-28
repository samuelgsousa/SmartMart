import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 10000,
    withCredentials: true
  });

export default httpClient;