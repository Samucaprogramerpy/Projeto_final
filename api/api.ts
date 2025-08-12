import axios from "axios";
import { obterToken, removerToken } from "../services/servicoTokken";


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout : 1000,
    headers: {
        'Content-Type' : 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await obterToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (erro) => {
        return Promise.reject(erro);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (erro) => {
        if (erro.response && erro.response.status === 401) {
            await removerToken();
            console.warn('Token de autenticação expirado ou invalido. Realize o login novamente.')
        }
        return Promise.reject(erro);
    }
);

export default api;