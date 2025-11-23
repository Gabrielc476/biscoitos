// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  // URL base do seu backend
  baseURL: 'http://192.168.0.6:3333',
  
  // Define um tempo limite para as requisições (ex: 10 segundos)
  timeout: 10000, 
  
  // Configura headers que podem ser úteis no futuro
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/*
  No futuro, se você adicionar autenticação (Login), 
  é aqui que você interceptará as requisições para adicionar o Token JWT.
*/

export default api;