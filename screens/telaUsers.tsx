import React from "react"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { CarregarSalas } from "../types/salas"
import { criarSalas, criarUsers, obterSalas } from "../services/servicoSalas"
import { CarregarUsuarios } from "../types/salas"
import api from "../api/api"
import { useTheme } from "react-native-paper"



export default function Users () {
    const [carregando, setCarregando] = useState(true)
    const [users, setUsers] = useState<CarregarUsuarios[]>([])
    const [visivel, setVisivel] = useState(false)
    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState(0)
    const [localizacao, setLocalizacao] = useState(0)
    const [descricao, setDescricao] = useState('')
    const [superuser, setSuperuser] = useState<boolean>(false)


    const mostrarModal = () => {
        setVisivel(!visivel)
  }
    useEffect(() => {
        
        
        
        const carregarSalas = async () => {
            setCarregando(true);
            try{
                const usuario = await api.get('accounts/list_users/')
                setUsers(usuario.data)
            } catch (error) {
                console.error('Não foi possivel carregar os produtos', error)
            } finally {
                setCarregando(false)
            }
        };
        carregarSalas()
    }, []);
    
     const renderizarSala = ({item} : {item: CarregarUsuarios}) => (
            <View style={style.CardSala}>
                    <Text style={style.nome}>{item.username}</Text>
                    <Text style={style.nome}>{item.email}</Text>
            </View>
    );

    const criarSala = async () => {
        mostrarModal()
        if (nomeSala.trim() === '' || capacidade === null|| localizacao === null) {
            console.error('Digite algo para fazer a requisição!')
        }
        if (capacidade !== localizacao) {
            console.error('Senhas diferentes')
        } else {
            try {
                const resposta = await criarUsers({username : nomeSala, password : capacidade, confirm_password : localizacao})
                return resposta
                
            } catch (error : any) {
                throw new Error('Erro ao adicionar sala', error)
            }
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
                                <Text>Nome*</Text>
                                <TextInput placeholder="Manuela" style={style.inputs} value={nomeSala} onChangeText={setNomeSala}></TextInput>
                                <Text>Senha*</Text>
                                <TextInput placeholder="Insira a senha" keyboardType="numeric" style={style.input2} value={capacidade} onChangeText={setCapacidade}></TextInput>
                                <Text>Confirme a senha*</Text>
                                <TextInput placeholder="Confirme a senha" style={style.localizacao} keyboardType="numeric" value={localizacao} onChangeText={setLocalizacao}></TextInput>
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
                data={users}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={style.containerList}
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
        borderRadius : 10,
        marginTop : 10,
        padding : 15,
        width : "90%",
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
        justifyContent : 'space-around',
        alignItems : 'center',
        flex : 1,
        backgroundColor : 'rgba(128, 128, 128, 0.5)',
    },
    containerList : {
        justifyContent : 'center',
        flexDirection: 'column',
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
        fontSize : 18,
        margin : 'auto'
    },
});

