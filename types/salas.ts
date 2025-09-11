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
    ultima_limpeza_data_hora : string | null;
    ultima_limpeza_funcionario : string | null;
    isClean? : boolean;
}

export interface CarregarUsuarios {
    id: number,
    username: string,
    email: string
}

export interface CriarUsuarios {
    username: string,
    password : number,
    confirm_password : number,
    is_staff : boolean,
    is_superuser : boolean
}