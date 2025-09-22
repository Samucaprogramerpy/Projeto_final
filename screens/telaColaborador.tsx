import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import { CarregarSalas } from "../types/salas"
import { obterToken } from "../services/servicoTokken";
import { Ionicons } from '@expo/vector-icons';
import { obterSalas} from "../services/servicoSalas"
import { Camera, CameraView } from "expo-camera";
import api from "../api/api";
import React from "react";
import {Menu, MenuTrigger, MenuOptions, MenuOption} from 'react-native-popup-menu'


function TelaColaborador(){
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [carregando, setCarregando] = useState(true)
    const [grupo, setGrupo] = useState<boolean>()
    const [permissao, setPermissao] = useState<boolean | null>(null)
    const [openCamera, setOpenCamera] = useState(false)


    
    const printID = (id) => {
        console.log(id)
    }

    const Deletar = ({data} : {data : string}) => {

        setOpenCamera(false)
        console.log(data)
    }

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
    }, [])

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
    }, [])

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted');
        })();
    }, [])


    if(openCamera) {
        return(
            <CameraView style={{flex : 1}} onBarcodeScanned={Deletar} facing="back" zoom={0}>
                <TouchableOpacity style={{width : 50, backgroundColor : 'rgba(0,0,0,0.8)', borderRadius : 50, alignItems : 'center', position : 'absolute', top : '95%', left : '80%'}} onPress={()=> setOpenCamera(false)}>
                    <Text style={{fontSize : 20, color : 'white'}}>X</Text>
                </TouchableOpacity>
            </CameraView>
        )
    }



    const renderizarSala = ({item} : {item: CarregarSalas}) => (
                <View style={{alignItems : 'center'}}>
                    <View style={style.CardSala}>
                        <View style={{borderBottomWidth : 1, width : '100%', justifyContent : 'space-around', flexDirection : 'row', borderBottomColor : '#004A8D'}}>
                            <Text style={{marginLeft : 5}}>{item.nome_numero}</Text>
                            <View style={{flex : 1,  justifyContent : "center", alignItems : 'flex-end'}}>
                                <Menu style={{alignItems : 'flex-end', width : 30, marginRight : 5}}>
                                    <MenuTrigger>
                                        <View>
                                            <Ionicons name="ellipsis-horizontal-outline" size={15}></Ionicons>
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions customStyles={{optionsContainer : style.optionsMenu}}>
                                        <MenuOption onSelect={() => printID(item.id)}>
                                            <Image style={{width : 25, height : 25}} source={require('../img/vassoura.png')}></Image>
                                        </MenuOption>
                                        <MenuOption onSelect={() => setOpenCamera(true)}>
                                            <Ionicons name="trash-outline" size={25} color={'red'}></Ionicons>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                                
                            </View>
                        </View>
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
        <SafeAreaView>
                <View style={{alignItems : 'center'}}>
                    <View style={{height : 100, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor : '#F7941D'}}>
                        <Text style={{paddingLeft : 10, fontSize : 20, fontWeight : 'bold', color: '#004A8D'}}>
                            Salas
                        </Text>
                    </View>
                    <FlatList
                        style={style.flatList}
                        data={salas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderizarSala}
                        nestedScrollEnabled={true}
                        />
                </View>
        </SafeAreaView>
    )
}

export default TelaColaborador;

const style = StyleSheet.create({
    cabecalho : {
        justifyContent : 'space-around'
    },
    centralizado : {
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
        width : '95%',
        height : '90%'
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
    },
    optionsMenu : {
        width : 50,
        alignItems : 'center',
        padding : 5,
        borderRadius : 5
    }
})