import React from "react"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, Switch } from "react-native"
import { useState, useEffect } from "react"
import { criarSalas, CriarUsers, obterSalas, obterUsers } from "../services/servicoSalas"
import { CarregarUsuarios } from "../types/salas"
import api from "../api/api"


export default function Users () {
    const [carregando, setCarregando] = useState(true)
    const [users, setUsers] = useState<CarregarUsuarios[]>([])
    const [visivel, setVisivel] = useState(false)
    const [nome, setNome] = useState('')
    const [Senha, setSenha] = useState(0)
    const [confirm_Senha, setConfirm_Senha] = useState(0)
    const [on, setOn] = useState<boolean>(false)
    const [admin, setAdmin] = useState<boolean>(false)



    const handleSwitch = () => {
        setOn(!on)
        if (on === false) {
            setAdmin(true)
        }
    }
    const mostrarModal = () => {
        setVisivel(!visivel)
  }
  const carregarUsers = async () => {
            try{
                const resposta = await api.get('accounts/list_users/')
                setUsers(resposta.data)
            } catch(error){
                console.error('Erro ao buscar usuários', error)
            }
    };
    useEffect(() => {
        carregarUsers()
    }, [carregarUsers()]);
    
     const renderizarSala = ({item} : {item: CarregarUsuarios}) => (
            <View style={style.containerList}>
                <View style={style.CardSala}>
                    <Text style={style.nome}>{item.username}</Text>
                    <Text style={style.nome}>{item.email}</Text>
                </View>
     
            </View>
    );

    const criarSala = async () => {
        mostrarModal()
        if (Senha !== confirm_Senha){
            console.error("Tente colocar senhas iguais")
        } else if (nome.trim() === '' || Senha === 0 || confirm_Senha === 0) {
            console.error("Insira todos os campos corretamente")
        } else {
            try{
                const resposta = CriarUsers({username : nome, password : Senha, confirm_password : confirm_Senha, is_staff : admin, is_superuser : admin})
                carregarUsers()
                setNome('')
                setSenha(0)
                setConfirm_Senha(0)
            } catch (error) {
                console.error("Erro ao criar usuário", error);
            }
            
        }
        

    }

    return (
        <View style={style.container}>  
            <Modal 
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={mostrarModal}>
                <View style={style.containerModal}>
                    <View style={style.modal}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text>Nome*</Text>
                                <TextInput placeholder="Manuela" style={style.inputs} value={nome} onChangeText={setNome}></TextInput>
                                <Text>Senha*</Text>
                                <TextInput placeholder="Insira a senha" keyboardType="numeric" style={style.input2} value={Senha} onChangeText={setSenha}></TextInput>
                                <Text>Confirme a senha*</Text>
                                <TextInput placeholder="Confirme a senha" style={style.localizacao} keyboardType="numeric" value={confirm_Senha} onChangeText={setConfirm_Senha}></TextInput>
                                <View style={style.setAdmin}>
                                    <Text>É Admin ?</Text>
                                    <View style={style.Switch}>
                                        <Switch
                                        value={on}
                                        onValueChange={handleSwitch}
                                        />
                                    </View>    
                                </View>
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
                <Text style={style.gerenciarUsuarios}>Gerenciar Usuários</Text>
                <TouchableOpacity style={style.mostrarModal} onPress={mostrarModal}>
                    <Text style={style.textplus}>+ Criar Usuario</Text>
                </TouchableOpacity>
            </View>
                <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />

            
        </View>
    )
}

const style = StyleSheet.create({

    container : {
        flex : 1
    },
    headerAdd : {
        justifyContent : 'space-around',
        height : 100,
        alignItems : 'center',
        display : 'flex',
        paddingBottom : 10,
        flexDirection : 'row'
    },
    CardSala : {
        backgroundColor : "white",
        borderRadius : 10,
        marginTop : 10,
        padding : 15,
        flexDirection : 'column',
        width : '90%'
    },
    modal : {
        padding : 30,
        backgroundColor : 'white',
        width : 300,
        height : 430,
        flexDirection : 'column',
        alignItems : 'flex-start',
        borderRadius : 10,
        borderWidth : 1.5,
        borderColor : '#F7941D'
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
    mostrarModal : {
        flexDirection : 'row',
        padding : 5,
        backgroundColor : '#004A8D',
        justifyContent : 'center',
    },
    info : {
        fontSize : 10
    },
    nome : {
        fontSize : 18,
        margin : 'auto'
    },
    textplus : {
        fontSize : 16,
        margin : 'auto',
        color : 'white'
    },
    gerenciarUsuarios : {
        fontSize : 18,
        fontWeight : 'bold'
    },
    setAdmin : {
        flexDirection : 'row',
        alignItems : 'center'
    },
    Switch : {
        marginLeft : 90,
        alignItems : 'center',
        paddingLeft : 30
    }
});

