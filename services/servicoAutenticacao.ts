import api from "../api/api";
import { CredenciaisLogin, RespostaLoginAPI } from "../types/api";


export async function realizarLogin(credenciais : CredenciaisLogin) : Promise<RespostaLoginAPI> {
    try {
        const resposta = await api.post<RespostaLoginAPI>('/accounts/login/', {
            username : credenciais.usuario,
            password : credenciais.senha
        });
        return resposta.data
        

    } catch (error : any) {  
        console.error(error.response.data)
    }
}