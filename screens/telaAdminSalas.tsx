import React from "react"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { CarregarSalas } from "../types/salas"
import { criarSalas, obterSalas } from "../services/servicoSalas"
import { obterToken } from "../services/servicoTokken"
import api from "../api/api"



export default function Salas () {
    const [carregando, setCarregando] = useState(true)
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [visivel, setVisivel] = useState(false)
    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState(0)
    const [localizacao, setLocalizacao] = useState('')
    const [descricao, setDescricao] = useState('')


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
    const mostrarModal = () => {
        setVisivel(!visivel)
  }
    useEffect(() => {
        
        
        
        const carregarSalas = async () => {
            setCarregando(true);
            try{
                const Salas = await obterSalas()
                const SalasFormatadas = Salas.map(sala => ({
                    ...sala,
                    isClean: sala.status_limpeza === 'Limpa'
                }));
                setSalas(SalasFormatadas)
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
                    <Text style={{ color: item.isClean ? 'green' : 'red' }}>
                        Status: {item.isClean ? 'Limpa' : 'Limpeza Pendente'}
                    </Text>
                    <TouchableOpacity onPress={()=>limpar(item.id)}><Text>Limpar</Text></TouchableOpacity>
            </View>
    );

    const criarSala = async () => {
        mostrarModal()
        try {
            const resposta = await criarSalas({nome_numero : nomeSala, capacidade : capacidade, localizacao : localizacao, descricao : descricao })
            return resposta
        } catch (error : any) {
            throw new Error('Erro ao adicionar sala', error)
        }
    }


    return (
        <>  
            <Modal 
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={mostrarModal}>
                <View style={style.containerModal}>
                    <View style={style.modal}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text>Nome da Sala*</Text>
                                <TextInput placeholder="Ex : Informática 1" style={style.inputs} value={nomeSala} onChangeText={setNomeSala}></TextInput>
                                <Text>Capacidade*</Text>
                                <TextInput placeholder="Ex: 30" keyboardType="numeric" style={style.input2} value={capacidade} onChangeText={setCapacidade}></TextInput>
                                <Text>Localização*</Text>
                                <TextInput placeholder="Ex: BLOCO A" style={style.localizacao} value={localizacao} onChangeText={setLocalizacao}></TextInput>
                                <Text>Descrição (Opcional)</Text>
                                <TextInput placeholder="Ex: Sala de informatica, Vaio" style={style.descricao} value={descricao} onChangeText={setDescricao}></TextInput>
                                <View style={style.viewAdd}>
                                    <TouchableOpacity style={style.buttonAdd} onPress={criarSala}>
                                        <Text style={style.textButton}>
                                            Adicionar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                    </View>
                </View>
            </Modal>
            <View style={style.headerAdd}>
                <TouchableOpacity onPress={mostrarModal}>
                    <Image style={style.add} source={require("../img/add.png")}/>
                </TouchableOpacity>

                
            </View>
                <FlatList
                data={salas}
                key={1}
                keyExtractor={(item) => item.nome_numero.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />
        </>
    )
}

const style = StyleSheet.create({

    headerAdd : {
        alignItems : 'flex-end',
        marginTop : 15,
        justifyContent:"center",
        display : 'flex'
    },
    CardSala : {
        backgroundColor : "white",
        alignItems : 'flex-start',
        borderRadius : 10,
        padding : 10,
        margin : 10,
        height : 150,
        width : '90%',
    },
    modal : {
        padding : 30,
        backgroundColor : 'white',
        width : 300,
        height : 430,
        flexDirection : 'column',
        alignItems : 'flex-start',
    },
    containerModal : {
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1,
    },
    inputs : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        marginBottom : 30
    },
    input2 : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        marginBottom : 30
    },
    descricao : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        paddingBottom : 120
    },
    localizacao : {
        borderWidth : 1,
        borderColor : 'black',
        width : '100%',
        borderRadius : 10,
        marginBottom : 30,
    },
    viewAdd : {
        flex : 1,
        alignItems : 'center',
        width : '100%',
        justifyContent : 'flex-end'
    },
    buttonAdd : {
        paddingRight : 80,
        backgroundColor : '#004A8D',
        paddingLeft : 80,
        paddingTop : 10,
        paddingBottom : 10,
        borderRadius : 10,
        marginTop : 15
    },
    textButton : {
        fontSize : 18,
        color : 'white'
    },
    add : {
        height : 35,
        width : 35
    },
    info : {
        fontSize : 10
    },
    nome : {
        borderBottomWidth : 1,
        borderColor : '#004A8D',
        width : '100%',
        padding : 2
    }
});

