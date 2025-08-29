import api from "../api/api";
import { CredenciaiSalas, CarregarSalas, CriarUsuarios } from "../types/salas";

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
        throw new Error(error.mensage || 'Erro ao buscar Salas.');
    }
}

export async function obterSalasporID(id : number) : Promise<CarregarSalas> {
    try {
        const resposta = await api.get<CarregarSalas>(`salas/${id}`);
        return resposta.data
    } catch (error : any) {
        throw new Error(error.mensage || 'Erro ao buscar Sala.');
    }
}

export async function criarUsers(credenciais:CriarUsuarios) {
    
    try {
        const resposta = await api.post('salas/', {
            nome : credenciais.username,
            senha : credenciais.password,
            confirmar_senha : credenciais.confirm_password
        });
        console.log(resposta.status)
    } catch (error : any) {
        if (error.response && error.response.status === 401) {      
            throw new Error('Credenciais inválidas. Verifique seu usuário e senha.');    
        }
        throw new Error('erro na requisição', error)
    }
    

}