import { Text, View, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { CarregarSalas } from "../types/salas"
import { obterSalas, obterSalasporID } from "../services/servicoSalas"
import api from "../api/api";
import React from "react";


function telaColaborador(){
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [carregando, setCarregando] = useState(true)
    const [cordoTexto, setCordoTexto] = useState('red')
    const [limpo, setLimpo] = useState('limpo')


    const printID = async (id) => {
        const StatusLimpo = {
            status_limpeza : 'limpa'
        }
        const salainfo = await api.get(`salas/${id}/`)
        const resposta = salainfo.data.status_limpeza
        if (resposta === 'Limpeza Pendente') {
            resposta === 'limpo'
        } else {
            resposta === 'Limpeza Pendente'
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
    });

    const renderizarSala = ({item} : {item: CarregarSalas}) => (
            <View style={style.CardSala}>
                <Text>{item.nome_numero}</Text>
                <Text>{item.capacidade}</Text>
                <Text>{item.localizacao}</Text>
                <Text>{item.descricao}</Text>
                <Text>Status : {item.status_limpeza}</Text>
                <TouchableOpacity onPress={()=> printID(item.id)}><Text>Limpar</Text></TouchableOpacity>
            </View>
        );
    return(
        <>
            <FlatList
                data={salas}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={renderizarSala}
                contentContainerStyle={style.centralizado}
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
        flexGrow : 1,
        alignItems : 'center',
    },
    CardSala : {
        display : 'flex',
        backgroundColor : "white",
        borderRadius : 10,
        margin : 10,
        alignItems : 'center',
        height : 180,
        width : 143
    },
    limparSala : {
        backgroundColor : '#004A8D'
    }
})