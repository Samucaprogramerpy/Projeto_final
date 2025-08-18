import api from "../api/api";
import { CredenciaisLogin, RespostaLoginAPI } from "../types/api";


export async function realizarLogin(credenciais : CredenciaisLogin) : Promise<RespostaLoginAPI> {
    try {
        const resposta = await api.post<RespostaLoginAPI>('auth/login', {
            username : credenciais.usuario,
            password : credenciais.senha,
        });
        return resposta.data
    } catch (error : any) {
        if (error.response && error.response.status === 401) {      
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');    
        }    
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');  
    }
}