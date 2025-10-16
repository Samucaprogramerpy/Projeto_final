import React from "react"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native"
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu"
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from "expo-camera"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CarregarSalas } from "../types/salas"
import { criarSalas, obterSalas, obterSalasporID } from "../services/servicoSalas"
import { obterToken } from "../services/servicoTokken"
import { Dimensions } from "react-native"
import api from "../api/api"
import Load from "./telaLoad"




export default function Salas () {
    const [carregando, setCarregando] = useState(true)
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [visivel, setVisivel] = useState(false)
    const [ErroSala, setErroSala] = useState<boolean | null>(null)
    const [permissao, setPermissao] = useState<boolean>(false)
    const [showCamera, setShowCamera] = useState(false)
    const [mensagemErro, setMensagemErro] = useState('')
    const [qr_code_id, setQrcodeID] = useState<any>()
    const [nomeSala, setNomeSala] = useState('')
    const [capacidade, setCapacidade] = useState()
    const [localizacao, setLocalizacao] = useState('')
    const [descricao, setDescricao] = useState('')
    const [modalEditor, setModalEditor] = useState(false)
    const navigation = useNavigation()
    const {width, height } = Dimensions.get('window')


    const telaMobile = width < 600

    const deletar  = async (qr_code_id : any) => {
        try{
            const resposta = await api.delete(`salas/${qr_code_id}/`)
            console.log(resposta.status)
        } catch(error : any) {
            console.error('Erro ao excluir a sala')
        }
        setCarregando(true)
        const resposta = await obterSalas()
        setSalas(resposta)
        setCarregando(false)
    }

   
    const mostrarModal = () => {
        setVisivel(!visivel)
  }

  const criarSala = async () => {
        if (nomeSala === '' || capacidade === null ||localizacao === null || descricao === null) {
            console.error("Insira todos os campos corretamente!")
        }
        try {
            const formData = new FormData;
            const dadosSala = {
                nome_numero : nomeSala,
                capacidade : capacidade,
                localizacao : localizacao,
                descricao : descricao
            };

            Object.entries(dadosSala).forEach(([key, value]) => {
                formData.append(key, String(value))
            })

            const resposta = await criarSalas(formData)

            console.log(resposta)
            setCarregando(true)
            setVisivel(false)
            const carregarSalas = await obterSalas()
            setSalas(carregarSalas)
            setCarregando(false)
        } catch (error : any) {
            throw new Error('Erro ao adicionar sala', error)
        }

        setNomeSala('')
        setDescricao('')
        setCapacidade(0),
        setLocalizacao('')
    }
    const encontrarSala = async(qr_code_id : any) => {
        setQrcodeID(qr_code_id)
        const sala = await obterSalasporID(qr_code_id)
        setModalEditor(true)
        setCarregando(true)
        setNomeSala(sala.nome_numero)
        setCapacidade(sala.capacidade)
        setLocalizacao(sala.localizacao)
        setDescricao(sala.descricao)
        setCarregando(false)
    }

    const atualizarSalas =async () => {
        
        const dadosSala = {
            nome_numero : nomeSala,
            capacidade : capacidade,
            localizacao : localizacao,
            ativa : true,
            descricao : descricao
        };
        try {
            const formData = new FormData()
            Object.entries(dadosSala).forEach(([key, value]) => {
                formData.append(key, String(value))
            })
            const resposta = await api.put(`salas/${qr_code_id}/`, formData, {
                headers : {
                    'Content-Type' : 'multipart/form-data'
                }
            })
            console.log(resposta.status)
        } catch (error : any) {
            console.error('Erro ao atualizar campos', error.response?.data)
        }
        setCarregando(true)
        setModalEditor(false)
        const salas = await obterSalas()
        setSalas(salas)
        setCarregando(false)
    }

    const marcarComoSuja =async (qr_code_id : any) => {
        try {
            const resposta = await api.post(`salas/${qr_code_id}/marcar_como_suja/`)
            console.log(resposta.status)
        } catch (error : any) {
            console.error("Erro ao marcar sala como suja", error)
        }
        setCarregando(true)
        const newSalas = await obterSalas()
        setSalas(newSalas)
        setCarregando(false)
    }


    useEffect( () => {
        const carregarSalas = async() => {
            try{
                setCarregando(true)
                const resposta = await obterSalas()
                setSalas(resposta)
                setCarregando(false)
            } catch(Error) {
                console.error(Error);
            }
        }
        carregarSalas()

        
    }, []);

    useEffect(() => {
            (async () => {
                const {status} = await Camera.requestCameraPermissionsAsync()
                setPermissao(status === 'granted')
        })()  
    },[])

    if(carregando) {
        return(
            <Load/>
        )
    }

    if(ErroSala) {
        return(
            <View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                <Text style={{fontSize : 18}}>
                    Foram encontradas nenhuma sala {mensagemErro}!
                </Text>
            </View>
        )
    }

    if (modalEditor) {
        return (
            <Modal transparent={true}>
                <View style={{flex : 1, padding : 15, marginTop : 10}}>
                <View showsVerticalScrollIndicator={false}>
                    <Text>Nome da Sala*</Text>
                    <TextInput placeholder="Ex : Informática 1" style={style.inputs} value={nomeSala} onChangeText={setNomeSala}></TextInput>
                    <Text>Capacidade*</Text>
                    <TextInput placeholder="Ex: 30" keyboardType="numeric" style={style.input2} value={capacidade} onChangeText={setCapacidade}></TextInput>
                    <Text>Localização*</Text>
                    <TextInput placeholder="Ex: BLOCO A" style={style.localizacao} value={localizacao} onChangeText={setLocalizacao}></TextInput>
                    <Text>Descrição (Opcional)</Text>
                    <TextInput placeholder="Ex: Sala de informatica, Vaio" style={style.descricao} value={descricao} onChangeText={setDescricao}></TextInput>
                    <View style={{flexDirection : 'row', justifyContent : 'space-around', marginTop : 10}}>
                        <TouchableOpacity style={{padding : 5, backgroundColor : '#F7941D'}} onPress={() => setModalEditor(false)}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{backgroundColor : '#004A8D', padding : 5}} onPress={atualizarSalas}>
                            <Text style={{color : 'white '}}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                
                </View>
            </Modal>
        )
    }
    
    if (visivel) {
        return(
            <Modal
                animationType="slide"
                transparent={true}>
                    <View style={{flex : 1, paddingHorizontal : 10, paddingVertical : 30, backgroundColor : 'white'}}>
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
                            <View style={{flexDirection : 'row', justifyContent:'space-between', width : '100%', marginBottom : '40%'}}>
                                        <TouchableOpacity style={{height : 40, width : 95, justifyContent : 'center', alignItems : 'center', backgroundColor : 'orange'}} onPress={mostrarModal}>
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
            </Modal>
        )
    }
    const renderizarSala = ({item} : {item: CarregarSalas}) => (
            <View>
                <View style={style.flatList}>
                    <TouchableOpacity onPress={() => navigation.navigate("DetalhesSalas", {IdSala : item.qr_code_id}) } style={{backgroundColor : "white",flexDirection : 'row', borderRadius : 10, margin : 10, height : telaMobile ? 150 : 190, width : '90%'}}>
                        <View style={{height : '100%', width : 100, borderRightWidth : 0, borderRadius : 10}}>
                            <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                        </View>

                        {/* view com o nome das salas */}
                        <View style={{flex : 1,flexDirection : 'column'}}>
                            <View style={{ width : '100%', flexDirection : 'row', justifyContent : 'space-around', borderBottomWidth : 1, paddingVertical : 5}}>
                                <Text style={{fontSize : 18}}>{item.nome_numero}</Text>

                                {/* View com as demais informações das salas */}
                                <View style={{flex : 0.9, alignItems : 'flex-end', justifyContent : 'center'}}>
                                    <Menu style={{marginRight : 5}}>
                                        <MenuTrigger>
                                            <View>
                                                <Ionicons name="ellipsis-horizontal-outline" size={15}></Ionicons>
                                            </View>
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{optionsContainer: style.menu}}>
                                            <MenuOption onSelect={() => deletar(item.qr_code_id)}>
                                                <Ionicons name="trash-outline" size={25} color={'red'}></Ionicons>
                                            </MenuOption>
                                            <MenuOption onSelect={()=> encontrarSala(item.qr_code_id)}>
                                                <Ionicons name='color-wand-outline' size={25} color={'blue'}></Ionicons>
                                            </MenuOption>
                                            <MenuOption onSelect={() => marcarComoSuja(item.qr_code_id)}>
                                                <Ionicons name="close-circle-outline" size={25}/>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            </View>
                                <View style={{paddingLeft : 5}}>
                                    <Text style={{fontSize : telaMobile ? 14 : 18}}><Text>Capacidade : </Text>{item.capacidade}</Text>
                                    <Text style={{fontSize : telaMobile ? 14 : 18}}>Localização : {item.localizacao}</Text>
                                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                        <Text style={{fontSize : telaMobile ? 14 : 18, marginTop : 5}}>
                                            Status:
                                        </Text>
                                        <Text style={{ color: item.status_limpeza === 'Limpa' ? 'green' : item.status_limpeza === 'Em Limpeza' ? 'white' : item.status_limpeza === 'limpeza Pendente' ? 'red' : 'red', 
                                            padding : 5, backgroundColor : item.status_limpeza === 'Limpa' ? 'rgba(162, 255, 162, 0.56)'  : item.status_limpeza === 'Em Limpeza' ? 'rgba(42, 42, 241, 0.81)' : 'rgba(241, 130, 130, 0.5)', borderRadius : 5, marginLeft : 5, marginTop : 5}}>
                                            {item.status_limpeza}
                                        </Text>
                                    </View>
                                </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
    );

   

    return (
        <View style={{flex : 1}}>
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
        marginTop : 20,
        alignItems : 'flex-end',
        justifyContent:"center",
        paddingTop : 10,
        paddingBottom : 10
        
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
        color : 'white',
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
        width : 150
    },
    textoLimpar : {
        color : 'white',
    },
    limpar : {
        backgroundColor : '#004A8D',
        height : 40,
        width : 100,
        alignItems : 'center',
        flexDirection : 'row'
    },
    flatList : {
        alignItems : 'center'
    }, 
    menu : {
        width : 50,
        alignItems : 'center',
        borderRadius : 5
    }
});

