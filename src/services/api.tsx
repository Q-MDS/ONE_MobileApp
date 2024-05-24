import axios from 'axios';

// const baseUrl = 'http://41.76.209.115/one';
const baseUrl = 'http://192.168.1.28/one';

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
