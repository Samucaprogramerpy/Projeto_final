import React from "react"
import { useNavigation } from "@react-navigation/native"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { CarregarSalas } from "../types/salas"
import { criarSalas, obterSalas } from "../services/servicoSalas"
import { obterToken } from "../services/servicoTokken"
import { Dimensions } from "react-native"
import api from "../api/api"



export default function Salas () {
    const [carregando, setCarregando] = useState(true)
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [visivel, setVisivel] = useState(false)
    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState(0)
    const [localizacao, setLocalizacao] = useState('')
    const [descricao, setDescricao] = useState('')
    const navigation = useNavigation()
    const {width, height } = Dimensions.get('window')

     

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
            <View style={style.flatList}>
                <TouchableOpacity onPress={() => navigation.navigate("DetalhesSalas", {IdSala : item.id}) } style={style.CardSala}>
                        <Text style={style.nome}>{item.nome_numero}</Text>
                        <Text>{item.capacidade}</Text>
                        <Text>{item.localizacao}</Text>
                        <Text>{item.descricao}</Text>
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                            <Text>
                                Status:
                            </Text>
                            <Text style={{ color: item.isClean ? 'green' : 'red', padding : 5, backgroundColor : item.isClean ? 'rgba(162, 255, 162, 0.56)'  : 'rgba(248, 133, 133, 0.42)', borderRadius : 5, marginLeft : 5}}>
                                {item.status_limpeza}
                            </Text>
                        </View>
                        <TouchableOpacity style={style.botaoLimpar} onPress={()=>limpar(item.id)}><Text style={style.textoLimpar}>Solicitar Limpeza</Text></TouchableOpacity>
                </TouchableOpacity>
            </View>
    );

    const criarSala = async () => {
        mostrarModal()
        if (nomeSala === '' || capacidade === null ||localizacao === null || descricao === null) {
            console.error("Insira todos os campos corretamente!")
        }
        try {
            const resposta = await criarSalas({nome_numero : nomeSala, capacidade : capacidade, localizacao : localizacao, descricao : descricao })

            console.log(resposta)
        } catch (error : any) {
            throw new Error('Erro ao adicionar sala', error)
        }
        carregarSalas()
        setNomeSala('')
        setDescricao('')
        setCapacidade(0),
        setLocalizacao('')
    }


    return (
        <View style={{flex : 1}}>
            <Modal 
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={mostrarModal}>
                <View style={style.containerModal}>
                    <View style={{backgroundColor : 'white', width : width > 600 ? 800 : '80%', padding : 30, borderRadius : 10}}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text>Nome da Sala*</Text>
                                <TextInput placeholder="Ex : Informática 1" style={style.inputs} value={nomeSala} onChangeText={setNomeSala}></TextInput>
                                <Text>Capacidade*</Text>
                                <TextInput placeholder="Ex: 30" keyboardType="numeric" style={style.input2} value={capacidade} onChangeText={setCapacidade}></TextInput>
                                <Text>Localização*</Text>
                                <TextInput placeholder="Ex: BLOCO A" style={style.localizacao} value={localizacao} onChangeText={setLocalizacao}></TextInput>
                                <Text>Descrição (Opcional)</Text>
                                <TextInput placeholder="Ex: Sala de informatica, Vaio" style={style.descricao} value={descricao} onChangeText={setDescricao}></TextInput>
                            </ScrollView>
                            <View style={{flexDirection : 'row', justifyContent:'space-between', paddingBlock : 10, width : '100%'}}>
                                        <TouchableOpacity style={{padding : 10, backgroundColor : 'orange'}} onPress={mostrarModal}>
                                            <Text style={{fontSize : 18}}>
                                                Cancelar
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={style.limpar} onPress={criarSala}>
                                            <Text style={style.textButton}>
                                                +  Adicionar
                                            </Text>
                                        </TouchableOpacity>
                            </View>
                    </View>
                </View>
            </Modal>
            <View style={style.headerAdd}>
                <TouchableOpacity style = {style.mostrarModal} onPress={mostrarModal}>
                    <Text style={style.buttonAdd}>+</Text>
                </TouchableOpacity>

                
            </View>
                <FlatList
                data={salas}
                key={1}
                keyExtractor={(item) => item.nome_numero.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />
        </View>  
    )
}

const style = StyleSheet.create({

    headerAdd : {
        alignItems : 'flex-end',
        justifyContent:"center",
        paddingTop : 10,
        paddingBottom : 10
        
    },
    CardSala : {
        backgroundColor : "white",
        alignItems : 'flex-start',
        borderRadius : 10,
        padding : 10,
        margin : 10,
        height : 190,
        width : '90%',
    },
    mostrarModal : {
        backgroundColor : '#004A8D',
        borderRadius : 50,
        paddingLeft : 15,
        paddingRight : 15,
        marginRight : 10,
    },
    modal : {
        padding : 30,
        backgroundColor : 'white',
        width : 300,
        height : 450,
        flexDirection : 'column',
        alignItems : 'center',
        borderRadius : 10
    },
    containerModal : {
        ...StyleSheet.absoluteFillObject,
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1,
        backgroundColor : "rgba(91, 91, 91, 0.79)"
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
        justifyContent : 'flex-end',
    },
    buttonAdd : {
        fontSize : 40,
        color : 'white',
    },
    textButton : {
        fontSize : 18,
        color : 'white'
    },
    info : {
        fontSize : 10
    },
    nome : {
        borderBottomWidth : 1,
        borderColor : '#004A8D',
        width : '100%',
        padding : 2
    },
    botaoLimpar : {
        marginTop : 30,
        marginLeft : 2,
        padding : 5,
        backgroundColor : '#004A8D',
        borderRadius : 5,
    },
    textoLimpar : {
        color : 'white',
    },
    limpar : {
        backgroundColor : '#004A8D',
        padding : 10,
        alignItems : 'center',
    },
    flatList : {
        alignItems : 'center'
    }
});

