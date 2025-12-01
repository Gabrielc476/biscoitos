// src/services/api.ts
import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Define a URL da API dinamicamente.
 * - Em Desenvolvimento: Tenta usar o IP da máquina (host do Expo).
 * - Em Produção: Usa a URL do Render.
 */
const getBaseUrl = () => {
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;

    if (debuggerHost) {
      // O hostUri vem no formato "192.168.0.6:8081". Pegamos só o IP.
      const ip = debuggerHost.split(':')[0];
      return `http://${ip}:3333`;
    }

    // Fallback para o IP identificado anteriormente, caso o hostUri falhe
    return 'http://192.168.0.6:3333';
  }

  return 'https://biscoitos.onrender.com';
};

const api = axios.create({
  baseURL: getBaseUrl(),

  // Define um tempo limite para as requisições
  timeout: 100000,

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