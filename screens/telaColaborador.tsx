import { Text, View, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { CarregarSalas } from "../types/salas"
import { obterToken } from "../services/servicoTokken";
import { obterSalas, obterSalasporID } from "../services/servicoSalas"
import api from "../api/api";
import React from "react";


function telaColaborador(){
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [carregando, setCarregando] = useState(true)
    const [cordoTexto, setCordoTexto] = useState('red')
    const [limpo, setLimpo] = useState('Limpeza Pendente')


    const limpar = async (id) => {
        try {
            const token = await obterToken();
            const resposta = await api.post(`salas/${id}/marcar_como_limpa/`, {}, {
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Token ${token}`
                }
            })
            console.log(resposta.data)
        } catch (error) {
            console.error('Erro ao trocar status da sala', error)
        }
    }
    

    useEffect(() => {        
        const carregarSalas = async () => {

            setCarregando(true);
            try{
                const Salas = await obterSalas()
                setSalas(Salas)
            } catch (error) {
                console.error('Não foi possivel carregar os produtos', error)
            } finally {
                setCarregando(false)
            }
        };
        carregarSalas()
    }, []);

    const renderizarSala = ({item} : {item: CarregarSalas}) => (
            <View style={style.CardSala}>
                <Text style={style.nome}>{item.nome_numero}</Text>
                <Text>{item.capacidade}</Text>
                <Text>{item.localizacao}</Text>
                <Text>{item.descricao}</Text>
                <Text>Status : {limpo}</Text>
                <TouchableOpacity onPress={()=>limpar(item.id)}><Text>Limpar</Text></TouchableOpacity>
            </View>
        );
    return(
        <>
            <FlatList 
                style={style.flatList}
                data={salas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />
        </>
    )
}

export default telaColaborador;

const style = StyleSheet.create({
    cabecalho : {
        justifyContent : 'space-around'
    },
    centralizado : {
    },
    nome : {
        borderBottomWidth : 1,
        borderColor : '#004A8D',
        width : '100%',
        padding : 2
    },
    CardSala : {
        display : 'flex',
        backgroundColor : "white",
        borderRadius : 10,
        margin : 10,
        alignItems : 'flex-start',
        height : 150,
        width : '90%',
        paddingLeft : 20,
        paddingTop : 10
    },
    limparSala : {
        backgroundColor : '#004A8D'
    },
    flatList : {
        width : '100%'
    }
})