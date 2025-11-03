import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image, Modal, TextInput } from "react-native";
import { TouchableOpacity, AppState } from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CarregarSalas } from "../types/salas"
import * as ImageManipulador from 'expo-image-manipulator'
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOption, MenuTrigger, MenuOptions } from "react-native-popup-menu";
import { obterSalas, obterSalasporID, obterUsers } from "../services/servicoSalas";
import { setValor, getValor} from "../services/servicoUpdate";
import { Camera, CameraView } from "expo-camera";
import { useFonts } from 'expo-font';
import api from "../api/api";
import Load from "./telaLoad";


export default function TelaColaborador(){
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [carregando, setCarregando] = useState(false)
    const [openCamera, setOpenCamera] = useState(false)
    const [grupo, setGrupo] = useState<boolean>(false) 
    const [idLimpeza, setIdLimpeza] = useState('') 
    const [fotoTirada, setFotoTirada] = useState<string | null>(null)
    const [permissao, setPermissao] = useState<boolean>(false);
    const [modal, showModal] = useState(false)
    const [salauuid, setSalaUUID] = useState('')
    const [fotoEnviada, setFotoEnviada] = useState<boolean>(false)
    const [search, setSearch] = useState('')
    const [salasFiltradas, setSalasFiltradas] = useState<CarregarSalas[]>([])
    const [fontsLoaded] = useFonts({
        "Ubuntu-Regular" : require('../fonts/Ubuntu-Regular.ttf'),
        "Ubunt-Bold" : require('../fonts/Ubuntu-Bold.ttf')
    })
    const foto = useRef<CameraView>(null)


    const abrirModal = async(qr_code_id : any) => {
        showModal(true)
        try {
            const resposta = await api.get(`limpezas/?sala_uuid=${qr_code_id}`)
            const sala = resposta.data
            const id = sala[0].id 
            setIdLimpeza(id)
        } catch(error) {
            console.error('erro ao procurar sala!', error)
        }
        setSalaUUID(qr_code_id)
    }


    const comecarLimpeza = async (qr_code_id : any) => {
        try {
            const formData = new FormData()
        

            formData.append('sala', qr_code_id)

            const resposta = await api.post(`salas/${qr_code_id}/iniciar_limpeza/`, formData)
            setIdLimpeza(resposta.data.id)
            setCarregando(true)
            const newSalas = await obterSalas()
            setSalas(newSalas)
            setCarregando(false)
            console.log(resposta.status)
        } catch(error) {
            console.error('Erro ao iniciar limpeza da sala', error)
        }
    }

    const tirarFoto = async () => {
        if (foto.current) {
            const newFoto = await foto.current.takePictureAsync({
                quality : 0.5,
                skipProcessing : false
            });            

            

            setFotoTirada(newFoto.uri)

            setOpenCamera(false)
        }
    }
    const concluirLimpeza = async () => {
            setCarregando(true)
            try {
                const formData = new FormData()

                const filename = fotoTirada?.split('/').pop();
                const filetype = 'image/jpeg'
                
                formData.append('registro_limpeza', idLimpeza)
                
                formData.append("imagem", {
                    uri: fotoTirada,
                    name: filename, 
                    type: filetype,
       
                } as any);

                const resposta = await api.post(`/fotos_limpeza/`, formData, {
                    headers : {
                        'Content-Type' : 'multipart/form-data'
                    }
                })
                
                try {

                    const resposta = await api.post(`salas/${salauuid}/concluir_limpeza/`)
                    console.log(resposta.status)
                } catch (error) {
                    console.error('Erro ao mudar status da sala', error)
                }
                
            } catch (error : any) {
                console.error("Erro ao executar a limpeza", error);
            } 
            showModal(false)
            setCarregando(false)

            const newSalas = await obterSalas()
            setSalas(newSalas)

        }
    
    const marcarComoSuja =async (qr_code_id : any) => {
        try {
            const resposta = await api.post(`salas/${qr_code_id}/marcar_como_suja/`)
            console.log(resposta.status)
        } catch (error) {
            console.error("Erro ao marcar sala como suja", error)
        }
        setCarregando(true)
        const newSalas = await obterSalas()
        setSalas(newSalas)
        setCarregando(false)
    }

    const carregarSalas = async () => {
        try{
            const Salas = await obterSalas()
            setSalas(Salas)
        } catch (error) {
            console.error('Não foi possivel carregar os produtos', error)
        }
    }; 
   


    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted')
        })();
    }, []);

    useEffect(() => {
        const group = async() => {
            try{
                const resposta = await api.get('accounts/current_user')
                const grupo_usuario = resposta.data.groups

                if (grupo_usuario.includes(2)) {
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
            if (search === '') {
              setSalasFiltradas(salas);
            } else {
              const produtosEncontrados = salas.filter(sala =>
                sala.nome_numero.toLowerCase().includes(search.toLowerCase()) ||
                sala.status_limpeza.toLowerCase().includes(search.toLowerCase())
              );
              setSalasFiltradas(produtosEncontrados);
            }
    }, [search, salas]);


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
    }, [])

    useFocusEffect(
        useCallback(() => {
            const verificar = async() => {
                await carregarSalas()
                console.log('201')
            };
            
            const intervalo = setInterval(verificar, 30000)

            return () => clearInterval(intervalo)
        }, [])
    )

    if (carregando) {
        return(
            <Load/>
        )
        
    }

    if (openCamera) {
        return(
            <View style={{flex : 1}}>
                <CameraView style={{flex : 1}} facing="back" zoom={0} ref={foto}/>
                <View style={{borderWidth : 1, height : 200, backgroundColor : 'black', alignItems : 'center', justifyContent : 'center', borderRadius : 5}}>
                    <TouchableOpacity onPress={tirarFoto}>
                        <Ionicons name="ellipse" size={70} color={'white'}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    


    const renderizarSala = ({item} : {item: CarregarSalas}) => {
            if (grupo === true) {
                return(
                    <View style={{alignItems : 'center'}}>
                        <View style={style.CardSala}>
                            <View style={{height : '100%', width : 100}}>
                                {item.imagem ? (
                                    <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                                ) : (
                                    <Image style={{flex : 1, resizeMode: 'cover', width : '100%' }} source={require('../img/Image-not-found.png')}/>
                                )}
                                                                
                            </View>
                            <View style={{flex : 1,marginTop : 5}}>
                                <View style={{borderBottomWidth : 1, width : '100%', justifyContent : 'flex-end', flexDirection : 'row', borderBottomColor : '#004A8D'}}>
                                    <View style={{width : '90%',  justifyContent : "center",flex : 1}}>
                                        <Text style={{marginLeft : 5, fontFamily : "Ubuntu-Regular"}}>{item.nome_numero}</Text>
                                    </View>
                                    <View style={{marginRight : 5}}>
                                        <Menu>
                                            <MenuTrigger>
                                                <View>
                                                    <Ionicons name="ellipsis-horizontal-outline" size={15}></Ionicons>
                                                </View>
                                            </MenuTrigger>
                                            <MenuOptions customStyles={{optionsContainer : style.menu}}>
                                                <MenuOption onSelect={() => marcarComoSuja(item.qr_code_id)}>
                                                    <Ionicons name="close-circle-outline" size={25}/>
                                                </MenuOption>
                                            </MenuOptions>
                                        </Menu>
                                    </View>
                                </View>
                                <View style={{flex : 1, justifyContent : 'space-around', paddingLeft : 5}}>
                                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                        <Ionicons name="cube-outline" size={20}/>
                                        <Text style={style.nomeinfo}>Capacidade: {item.capacidade}</Text>
                                    </View>
                                    <View style={{flexDirection : 'row', width : '90%', alignItems : 'center'}}>
                                        <Ionicons name="location-outline" size={20}/>
                                        <Text style={style.nomeinfo}>Localização: {item.localizacao}</Text>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                        <Ionicons name="alert-circle-outline" size={20}/>
                                        <Text style={style.nomeinfo}>Estado : {item.ativa ? 'Ativa' : 'Não Ativa'}</Text>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                        <Ionicons name="checkmark-circle-outline" size={20}/>
                                        <Text style={style.nomeinfo}>Status : </Text>
                                        <Text style={{ fontSize : 12, color:item.status_limpeza==='Limpa' ? 'rgba(46, 147, 46, 1)' : item.status_limpeza==='Em Limpeza' ? 'white' : 'rgba(237, 8, 8, 0.91)', backgroundColor : item.status_limpeza==='Limpa' ? 'rgba(178, 246, 206, 1)' : item.status_limpeza==='Em Limpeza' ? 'rgba(38, 38, 253, 0.96)' : 'rgba(253, 79, 79, 0.53)',padding : 5, textAlign : 'center', borderRadius : 5}}>
                                            {item.status_limpeza}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
            if (item.status_limpeza === 'Em Limpeza'){
                return (
                    <View style={{alignItems : 'center'}}>
                    <View style={style.CardSala}>
                        <View style={{height : '100%', width : 100}}>
                                {item.imagem ? (
                                    <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                                ) : (
                                    <Image style={{flex : 1, resizeMode: 'cover', width : '100%' }} source={require('../img/Image-not-found.png')}/>
                                )}
                                                                
                        </View>
                        <View style={{flex : 1, marginTop : 5}}>
                            <View style={{borderBottomWidth : 1, width : '100%', justifyContent : 'flex-end', flexDirection : 'row', borderBottomColor : '#004A8D'}}>
                                <View style={{width : '90%',  justifyContent : "center",flex : 1}}>
                                    <Text style={{marginLeft : 5, fontFamily : "Ubuntu-Bold"}}>{item.nome_numero}</Text>
                                </View>
                                <View style={{marginRight : 5}}>
                                    <Menu>
                                        <MenuTrigger>
                                            <View>
                                                <Ionicons name="ellipsis-horizontal-outline" size={15}></Ionicons>
                                            </View>
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{optionsContainer : style.menu}}>
                                            <MenuOption onSelect={() => abrirModal(item.qr_code_id)}>
                                                <Ionicons name="stop-circle-outline" size={25}/>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            </View>
                            <View style={{flex : 1, justifyContent : 'space-around', paddingLeft : 5}}>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Ionicons name="cube-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Capacidade: {item.capacidade}</Text>
                                </View>
                                <View style={{flexDirection : 'row', width : '90%', alignItems : 'center'}}>
                                    <Ionicons name="location-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Localização: {item.localizacao}</Text>
                                </View>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Ionicons name="alert-circle-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Estado : {item.ativa ? 'Ativa' : 'Não Ativa'}</Text>
                                </View>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Ionicons name="checkmark-circle-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Status : </Text>
                                    <Text style={{ fontSize : 12, color:item.status_limpeza==='Limpa' ? 'rgba(46, 147, 46, 1)' : item.status_limpeza==='Em Limpeza' ? 'white' : 'rgba(237, 8, 8, 0.91)', backgroundColor : item.status_limpeza==='Limpa' ? 'rgba(178, 246, 206, 1)' : item.status_limpeza==='Em Limpeza' ? 'rgba(38, 38, 253, 0.96)' : 'rgba(253, 79, 79, 0.53)',padding : 5, textAlign : 'center', borderRadius : 5}}>
                                        {item.status_limpeza}
                                    </Text>
                                </View>
                            </View>
                            {modal ?
                                <Modal transparent={true} onRequestClose={() => showModal(false)}>
                                    <View style={{flex : 1, alignItems : 'center', justifyContent : 'center', backgroundColor : 'rgba(0,0,0,0.1)'}}>
                                        <View style={{borderWidth : 1, backgroundColor : 'white', padding : 20, alignItems : 'center', height : '50%', width : '90%', justifyContent : 'center'}}>
                                            <TouchableOpacity onPress={() => {setOpenCamera(true)}} style={{alignItems : 'center', borderWidth : 1, width : '100%', height : '30%', justifyContent : 'center', backgroundColor : 'rgba(0,0,0,0.1)', borderColor : 'rgba(0,0,245,1)', borderStyle : 'dashed'}}>
                                                <Ionicons name="camera-outline" size={30} color={'gray'}/>
                                                <Text>Clique aqui para tirar a foto</Text>
                                            </TouchableOpacity>
                                            {fotoTirada ? (
                                            <View style={{ width : '100%'}}>
                                                <View style={{marginTop : 10, marginRight : 92}}>
                                                    <View style={{borderWidth : 1, width : 100}}>
                                                        <Image style={{width : 100, height : 100, resizeMode : 'cover'}} source={{uri : fotoTirada}}/>
                                                        <TouchableOpacity style={{position : 'absolute', left : '85%'}} onPress={()=>setFotoTirada(null)}>
                                                            <Ionicons name="close-circle" size={15} color={'black'}/>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                 <TouchableOpacity onPress={concluirLimpeza} style={{backgroundColor : 'blue', width : 150, paddingVertical : 10, alignItems : 'center', borderRadius : 10, marginHorizontal : 'auto', marginTop : 50}}><Text style={{color : 'white'}}>Enviar</Text></TouchableOpacity>
                                            </View>
                                            ) : (
                                                <View style={{marginTop : '65%'}}>
                                                <Text style={{paddingVertical : 10, backgroundColor : 'rgba(67, 66, 66, 0.38)', borderRadius : 20, width : 80, textAlign : 'center'}}>
                                                    Enviar
                                                </Text>
                                                </View>
                            
                                            )}
                                        </View>
                                    </View>
                                </Modal> : null}
                                                </View>
                                            </View>
                        </View>
                )
            }
            return(
                <View style={{alignItems : 'center'}}>
                    <View style={style.CardSala}>
                         <View style={{height : '100%', width : 100}}>
                                {item.imagem ? (
                                    <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                                ) : (
                                    <Image style={{flex : 1, resizeMode: 'cover', width : '100%' }} source={require('../img/Image-not-found.png')}/>
                                )}
                                                                
                        </View>
                        <View style={{flex : 1, marginTop : 5, justifyContent : 'space-around', width : '100%'}}>
                            <View style={{borderBottomWidth : 1, width : '100%', justifyContent : 'flex-end', flexDirection : 'row', borderBottomColor : '#004A8D'}}>
                                <View style={{width : '90%',  justifyContent : "center",flex : 1}}>
                                    <Text style={{marginLeft : 5, fontFamily : "MomoDisplay-Regular"}}>{item.nome_numero}</Text>
                                </View>
                                <View style={{marginRight : 5}}>
                                    <Menu>
                                        <MenuTrigger>
                                            <View>
                                                <Ionicons name="ellipsis-horizontal-outline" size={15}></Ionicons>
                                            </View>
                                        </MenuTrigger>
                                        <MenuOptions customStyles={{optionsContainer : style.menu}}>
                                            <MenuOption onSelect={() => comecarLimpeza(item.qr_code_id)}>
                                                <Image style={{width : 25, height : 25}} source={require('../img/vassoura.png')}/>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            </View>
                            <View style={{flex : 1, justifyContent : 'space-around', paddingLeft : 5}}>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Ionicons name="cube-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Capacidade: {item.capacidade}</Text>
                                </View>
                                <View style={{flexDirection : 'row', width : '90%', alignItems : 'center'}}>
                                    <Ionicons name="location-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Localização: {item.localizacao}</Text>
                                </View>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Ionicons name="alert-circle-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Estado : {item.ativa ? 'Ativa' : 'Não Ativa'}</Text>
                                </View>
                                <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                    <Ionicons name="checkmark-circle-outline" size={20}/>
                                    <Text style={style.nomeinfo}>Status : </Text>
                                    <Text style={{ fontSize : 12, color:item.status_limpeza==='Limpa' ? 'rgba(46, 147, 46, 1)' : item.status_limpeza==='Em Limpeza' ? 'white' : 'rgba(237, 8, 8, 0.91)', backgroundColor : item.status_limpeza==='Limpa' ? 'rgba(178, 246, 206, 1)' : item.status_limpeza==='Em Limpeza' ? 'rgba(38, 38, 253, 0.96)' : 'rgba(253, 79, 79, 0.53)',padding : 5, textAlign : 'center', borderRadius : 5}}>
                                        {item.status_limpeza}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
            </View>
            )
        };

    return(
        <View>
            <View style={{height : 110, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor : '#F7941D'}}>
                <Text style={{paddingLeft : 10, fontSize : 20, fontWeight : 'bold', color: '#004A8D'}}>
                    Salas
                </Text>
                <TextInput style={{width : '100%', height : 50, backgroundColor : 'rgba(146, 146, 146, 0.5)', borderRadius : 20}} placeholder="Procure por uma sala" value={search} onChangeText={setSearch}></TextInput>
            </View>
            <FlatList 
                style={style.flatList}
                data={salasFiltradas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />
        </View>
    )
}

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
        flexDirection : 'row',
        alignItems : 'flex-start',
        height : 200,
        width : '90%',
    },
    limparSala : {
        backgroundColor : '#004A8D'
    },
    flatList : {
        width : '100%',
        height : '83%'
    },
    nomeinfo : {
        paddingLeft : 5,
        fontFamily : "Ubuntu-Regular",
        fontSize : 13
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
    menu : {
        width : 50,
        alignItems : 'center'
    }
})