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
    const [grupo, setGrupo] = useState<boolean>()

    const limpar = async (id) => {
        try {
            const token = await obterToken();
            const resposta = await api.post(`salas/${id}/marcar_como_limpa/`, {}, {
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Token ${token}`
                }
            })
            const respostalimpa = await api.get(`salas/${id}`)
            const limpa = respostalimpa.data.status_limpeza
            if (limpa === "Limpa") {
                console.log('Erro ao trocar status. Talvez a sala ja esteja limpa')
                setSalas(salasAtuais => {
                    return salasAtuais.map(sala => {
                        if (sala.id === id) {
                            return {...sala, isClean : true}
                        }
                        return sala
                        
                    })
                })   
            } else {
                setSalas(salasAtuais => {
                    return salasAtuais.map(sala => {
                        if (sala.id === id) {
                            return {...sala, isClean : !sala.isClean}
                        }
                        return sala
                        
                    })
                }) 
            }  
        } catch (error) {
            console.error('Erro ao trocar status da sala', error)
        }
    }
    useEffect(() => {
        const group = async() => {
            try{
                const resposta = await api.get('accounts/current_user')
                const grupo_usuario = resposta.data.groups

                if (grupo_usuario.includes(1)) {
                    setGrupo(true)
                } else {
                    setGrupo(false)
                }

            } catch(error) {
                console.error(error)
            }
        } 
        group()
    })

    useEffect(() => {        
        const carregarSalas = async () => {

            setCarregando(true);
            try{
                const Salas = await obterSalas()
                const SalasFormatadas = Salas.map(sala => ({
                    ...sala,
                    isClean: sala.status_limpeza === 'Limpa'
                }));
                console.log(Salas)
                setSalas(SalasFormatadas)
            } catch (error) {
                console.error('Não foi possivel carregar os produtos', error)
            } finally {
                setCarregando(false)
            }
            
        };
        carregarSalas()
    }, [])



    const renderizarSala = ({item} : {item: CarregarSalas}) => (
            <View style={{alignItems : 'center'}}>
                <View style={style.CardSala}>
                    <Text style={style.nome}>{item.nome_numero}</Text>
                    <Text style={style.nomeinfo}>{item.capacidade}</Text>
                    <Text style={style.nomeinfo}>{item.localizacao}</Text>
                    <Text style={style.nomeinfo}>{item.descricao}</Text>
                    <View style={{flexDirection : 'row', alignItems : 'center', marginHorizontal : 10}}>
                        <Text>Status : </Text>
                        <Text style={{paddingLeft : 10, color:item.isClean ? 'rgba(46, 147, 46, 1)' : 'rgba(178, 65, 65, 1)', backgroundColor : item.isClean ? 'rgba(178, 246, 206, 1)' : 'rgba(248, 173, 173, 1)', paddingRight : 10,padding : 5, textAlign : 'center', borderRadius : 5}}>
                            {item.isClean ? 'Limpa' : 'Limpeza Pendente'}
                        </Text>
                    </View>
                    {grupo ? (
                        <TouchableOpacity onPress={() => limpar(item.id)} style={{backgroundColor : '#004A8D', padding : 5, marginLeft : 10, marginTop : 10, borderRadius: 5}}>
                            <Text style={{color : 'white'}}>Limpar</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={{backgroundColor : '#004A8D', padding : 5, marginLeft : 10, marginTop : 10, borderRadius: 5}}>
                            <Text style={{color : 'white'}}>
                                Solicitar Limpeza
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
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
        paddingLeft : 10,
        paddingBottom : 2
    },
    CardSala : {
        display : 'flex',
        backgroundColor : "white",
        borderRadius : 10,
        margin : 10,
        alignItems : 'flex-start',
        height : 180,
        width : '90%',
        paddingTop : 10
    },
    limparSala : {
        backgroundColor : '#004A8D'
    },
    flatList : {
        width : '100%'
    },
    nomeinfo : {
        paddingLeft : 10
    },
    botaoLimpar : {
        marginTop : 30,
        marginLeft : 5,
        padding : 5,
        backgroundColor : '#004A8D',
        borderRadius : 5,
    },
    textoLimpar : {
        color : 'white',
    }
})