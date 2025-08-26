export interface CredenciaiSalas {
    nome_numero : string | number;
    capacidade : number;
    descricao : string;
    localizacao : string
}

export interface CarregarSalas {
    id : number;
    nome_numero : string | number;
    capacidade : number;
    descricao : string;
    localizacao : string;
    status_limpeza : string;
}