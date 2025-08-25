import api from "../api/api";
import { CredenciaiSalas, CarregarSalas } from "../types/salas";

export async function criarSalas(credenciais:CredenciaiSalas) {
    
    try {
        const resposta = await api.post('salas/', {
            nome_numero : credenciais.nome_numero,
            capacidade : credenciais.capacidade,
            descricao : credenciais.descricao,
            localizacao : credenciais.localizacao
        });
        console.log(resposta.status)
    } catch (error : any) {
        if (error.response && error.response.status === 401) {      
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');    
        }
        throw new Error('erro na requisição', error)
    }
    

}

export async function obterSalas() : Promise<CarregarSalas[]> {
    try {
        const resposta = await api.get<CarregarSalas[]>('salas/');
        return resposta.data
    } catch (error : any) {
        throw new Error(error.mensage || 'Erro ao buscar produtos.');
    }
}