import React from "react"
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native"
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native"
import { NotoSans_400Regular, NotoSans_700Bold} from '@expo-google-fonts/noto-sans';
import { useFonts } from "expo-font";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu"
import { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from "expo-camera"
import { useState, useEffect, useRef } from "react"
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
    const [modal, setModal] = useState<boolean>(false)
    const navigation = useNavigation()
    const {width, height } = Dimensions.get('window')
    const [search, setSearch] = useState<string>('')
    const [idLimpeza, setIdLimpeza] = useState<string>('')
    const [salauuid, setSalaUuid] = useState<string>('')
    const [SalasFiltradas, setSalasFiltradas] = useState<CarregarSalas[]>([])
    const [fotoTirada, setFotoTirada] = useState<string | null>(null)
    const [grupo, setGrupo] = useState<boolean>(false)
    const foto = useRef<CameraView>(null)

    let [fontsLoaded] = useFonts({
        'NotoSansRegular' : NotoSans_400Regular,
        'NotoSansBold' : NotoSans_700Bold
    })


    const telaMobile = width < 600

    const carregarSalas = async() => {
            try{
                const resposta = await obterSalas()
                setSalas(resposta)
            } catch(Error) {
                console.error(Error);
        }
    }

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

    const abrirCamera = () => {
        setShowCamera(true)
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
        } catch(error : any) {
            console.error('Erro ao iniciar limpeza da sala', error.response.data)
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
            setModal(false)
            setCarregando(false)

            const newSalas = await obterSalas()
            setSalas(newSalas)

        }

    const tirarFoto = async () => {
        if (foto.current) {
            const newFoto = await foto.current.takePictureAsync({
                quality : 0.5,
                skipProcessing : false
            });            

            

            setFotoTirada(newFoto.uri)

            setShowCamera(false)
        }
    }

    const abrirModal = async(qr_code_id : any) => {
        setModal(true)
        try {
            const resposta = await api.get(`limpezas/?sala_uuid=${qr_code_id}`)
            const sala = resposta.data
            const id = sala[0].id 
            setIdLimpeza(id)
        } catch(error) {
            console.error('erro ao procurar sala!', error)
        }
        setSalaUuid(qr_code_id)
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

    useFocusEffect(
        useCallback(() => {
            const verificar = async() => {
                await carregarSalas()
            };
            
            const intervalo = setInterval(verificar, 20000)

            return () => clearInterval(intervalo)
        }, [])
    )


    useEffect(() => {
            (async () => {
                const {status} = await Camera.requestCameraPermissionsAsync()
                setPermissao(status === 'granted')
        })()  
    },[])

     useEffect(() => {
        const group = async() => {
            try{
                const resposta = await api.get('accounts/current_user')
                const grupo_usuario = resposta.data.groups
                if (grupo_usuario.includes([1,2])) {
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

    if (showCamera) {
        return(
             <View style={{flex : 1}}>
                <CameraView style={{flex : 1}} facing="back" zoom={0} ref={foto}/>
                <View style={{borderWidth : 1, height : 200, backgroundColor : 'black', alignItems : 'center', justifyContent : 'center', borderRadius : 5, flexDirection : 'row'}}>
                    <TouchableOpacity onPress={tirarFoto} style={{position : 'static'}}>
                        <Ionicons name="ellipse" size={70} color={'white'}/>
                    </TouchableOpacity>
                    <View style={{left : '30%'}}>
                        <TouchableOpacity onPress={() => setShowCamera(false)}>
                            <Text style={{padding : 15, borderRadius : 50, fontSize : 20, backgroundColor : 'white'}}>
                                X
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    const renderizarSala = ({item} : {item: CarregarSalas}) => {
        if (grupo) {
            if (item.status_limpeza === 'Em Limpeza'){
                return (
                    <View>
                        <View style={style.flatList}>
                            <TouchableOpacity onPress={() => navigation.navigate("DetalhesSalas", {IdSala : item.qr_code_id}) } style={{backgroundColor : "white",flexDirection : 'row', borderRadius : 10, margin : 10, height : telaMobile ? 170 : 190, width : '90%'}}>
                                <View style={{height : '100%', width : 100, borderRightWidth : 0, borderRadius : 10}}>
                                    {item.imagem ? (
                                        <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                                    ) : (
                                        <Image style={{flex : 1, resizeMode: 'cover', width : '100%' }} source={require('../img/Image-not-found.png')}/>
                                    )}
                                    

                                </View>

                                {modal ? 
                                <Modal transparent={true}>
                                    <View style={{flex : 1, alignItems : 'center', justifyContent : 'center', backgroundColor : 'white'}}>
                                        <View style={{borderWidth : 1, backgroundColor : 'white', padding : 20, alignItems : 'center', height : '50%', width : '90%', justifyContent : 'center'}}>
                                            <TouchableOpacity style={{alignItems : 'center', borderWidth : 1, padding : 30, backgroundColor : 'rgba(0,0,0,0.05)'}} onPress={abrirCamera}>
                                                <Ionicons name="camera-outline" size={30} color={'gray'}/>
                                                <Text>Clique aqui para tirar fotos</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {fotoTirada ? (
                                            <View style={{ width : '100%'}}>
                                                <View style={{marginTop : 10, marginRight : 92}}>
                                                    <View style={{borderWidth : 1, width : 100, marginLeft : '20%'}}>
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
                                                <Text style={{paddingVertical : 10, backgroundColor : 'rgba(67, 66, 66, 0.38)', borderRadius : 20, width : 80, textAlign : 'center', bottom : '100%'}}>
                                                    Enviar
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </Modal> : null
                            }


                                {/* view com o nome das salas */}
                                <View style={{flex : 1,flexDirection : 'column'}}>
                                    <View style={{ width : '100%', flexDirection : 'row', justifyContent : 'space-around', borderBottomWidth : 1, paddingLeft : 10, paddingVertical : 5}}>
                                        <Text style={{fontSize : 14, flexShrink : 1, width : '85%', fontFamily : 'NotoSansBold'}}>{item.nome_numero}</Text>

                                        {/* View com as demais informações das salas */}
                                        <View style={{flex : 1, alignItems : 'flex-end', justifyContent : 'center', position : 'static'}}>
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
                                                    <MenuOption onSelect={() => abrirModal(item.qr_code_id)}>
                                                        <Ionicons name="stop-circle-outline" size={25}/>
                                                    </MenuOption>
                                                </MenuOptions>
                                            </Menu>
                                        </View>

                                    </View>
                                        <View style={{paddingLeft : 5, padding : 10}}>
                                            <Text style={{fontSize : telaMobile ? 12 : 14, padding : 2, fontFamily : 'NotoSansRegular'}}><Text>Capacidade : </Text>{item.capacidade}</Text>
                                            <Text style={{fontSize : telaMobile ? 12 : 14, padding : 2, fontFamily : 'NotoSansRegular'}}>Localização : {item.localizacao}</Text>
                                            <View style={{flexDirection : 'row', alignItems : 'center', padding : 2}}>
                                                <Text style={{fontSize : telaMobile ? 13 : 14, marginTop : 5, fontFamily : 'NotoSansRegular'}}>
                                                    Status:
                                                </Text>
                                                <Text style={{fontSize : 12, color: item.status_limpeza === 'Limpa' ? 'green' : item.status_limpeza === 'Em Limpeza' ? 'white' : item.status_limpeza === 'limpeza Pendente' ? 'red' : 'red', 
                                                    padding : 5, backgroundColor : item.status_limpeza === 'Limpa' ? 'rgba(162, 255, 162, 0.56)'  : item.status_limpeza === 'Em Limpeza' ? 'rgba(42, 42, 241, 0.81)' : 'rgba(241, 130, 130, 0.5)', borderRadius : 5, marginLeft : 5, marginTop : 5, 
                                                    fontFamily : 'NotoSansRegular'}}>
                                                    {item.status_limpeza}
                                                </Text>
                                            </View>
                                        </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                </View>
            )}
             return (
                <View>
                    <View style={style.flatList}>
                        <TouchableOpacity onPress={() => navigation.navigate("DetalhesSalas", {IdSala : item.qr_code_id}) } style={{backgroundColor : "white",flexDirection : 'row', borderRadius : 10, margin : 10, height : telaMobile ? 170 : 190, width : '90%'}}>
                            <View style={{height : '100%', width : 100, borderRightWidth : 0, borderRadius : 10}}>
                                {item.imagem ? (
                                        <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                                ) : (
                                    <Image style={{flex : 1, resizeMode: 'cover', width : '100%' }} source={require('../img/Image-not-found.png')}/>
                                )}
                                

                            </View>

                            {/* view com o nome das salas */}
                            <View style={{flex : 1,flexDirection : 'column'}}>
                                <View style={{ width : '100%', flexDirection : 'row', justifyContent : 'space-around', borderBottomWidth : 1, paddingLeft : 10, paddingVertical : 5}}>
                                    <Text style={{fontSize : 14, flexShrink : 1, width : '85%', fontFamily : 'NotoSansBold'}}>{item.nome_numero}</Text>

                                    {/* View com as demais informações das salas */}
                                    <View style={{flex : 1, alignItems : 'flex-end', justifyContent : 'center', position : 'static'}}>
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
                                                <MenuOption>
                                                    <Image style={{height : 25, width : 25}} source={require('../img/vassoura.png')}/>
                                                </MenuOption>
                                            </MenuOptions>
                                        </Menu>
                                    </View>

                                </View>
                                    <View style={{paddingLeft : 5, padding : 10}}>
                                        <Text style={{fontSize : telaMobile ? 12 : 14, padding : 2, fontFamily : 'NotoSansRegular'}}><Text>Capacidade : </Text>{item.capacidade}</Text>
                                        <Text style={{fontSize : telaMobile ? 12 : 14, padding : 2, fontFamily : 'NotoSansRegular'}}>Localização : {item.localizacao}</Text>
                                        <View style={{flexDirection : 'row', alignItems : 'center', padding : 2}}>
                                            <Text style={{fontSize : telaMobile ? 13 : 14, marginTop : 5, fontFamily : 'NotoSansRegular'}}>
                                                Status:
                                            </Text>
                                            <Text style={{fontSize : 12, color: item.status_limpeza === 'Limpa' ? 'green' : item.status_limpeza === 'Em Limpeza' ? 'white' : item.status_limpeza === 'limpeza Pendente' ? 'red' : 'red', 
                                                padding : 5, backgroundColor : item.status_limpeza === 'Limpa' ? 'rgba(162, 255, 162, 0.56)'  : item.status_limpeza === 'Em Limpeza' ? 'rgba(42, 42, 241, 0.81)' : 'rgba(241, 130, 130, 0.5)', borderRadius : 5, marginLeft : 5, marginTop : 5, 
                                                fontFamily : 'NotoSansRegular'}}>
                                                {item.status_limpeza}
                                            </Text>
                                        </View>
                                    </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
        )}

        
    return (
        <View>
            <View style={style.flatList}>
                <TouchableOpacity onPress={() => navigation.navigate("DetalhesSalas", {IdSala : item.qr_code_id}) } style={{backgroundColor : "white",flexDirection : 'row', borderRadius : 10, margin : 10, height : telaMobile ? 170 : 190, width : '90%'}}>
                    <View style={{height : '100%', width : 100, borderRightWidth : 0, borderRadius : 10}}>
                        {item.imagem ? (
                                <Image style={{flex : 1, resizeMode : 'cover', borderTopLeftRadius : 10, borderBottomLeftRadius : 10}} source={{uri : `https://zeladoria.tsr.net.br/${item.imagem}`}}></Image>
                        ) : (
                            <Image style={{flex : 1, resizeMode: 'cover', width : '100%' }} source={require('../img/Image-not-found.png')}/>
                        )}
                        

                    </View>

                    {/* view com o nome das salas */}
                    <View style={{flex : 1,flexDirection : 'column'}}>
                        <View style={{ width : '100%', flexDirection : 'row', justifyContent : 'space-around', borderBottomWidth : 1, paddingLeft : 10, paddingVertical : 5}}>
                            <Text style={{fontSize : 14, flexShrink : 1, width : '85%', fontFamily : 'NotoSansBold'}}>{item.nome_numero}</Text>

                            {/* View com as demais informações das salas */}
                            <View style={{flex : 1, alignItems : 'flex-end', justifyContent : 'center', position : 'static'}}>
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
                            <View style={{paddingLeft : 5, padding : 10}}>
                                <Text style={{fontSize : telaMobile ? 12 : 14, padding : 2, fontFamily : 'NotoSansRegular'}}><Text>Capacidade : </Text>{item.capacidade}</Text>
                                <Text style={{fontSize : telaMobile ? 12 : 14, padding : 2, fontFamily : 'NotoSansRegular'}}>Localização : {item.localizacao}</Text>
                                <View style={{flexDirection : 'row', alignItems : 'center', padding : 2}}>
                                    <Text style={{fontSize : telaMobile ? 13 : 14, marginTop : 5, fontFamily : 'NotoSansRegular'}}>
                                        Status:
                                    </Text>
                                    <Text style={{fontSize : 12, color: item.status_limpeza === 'Limpa' ? 'green' : item.status_limpeza === 'Em Limpeza' ? 'white' : item.status_limpeza === 'limpeza Pendente' ? 'red' : 'red', 
                                        padding : 5, backgroundColor : item.status_limpeza === 'Limpa' ? 'rgba(162, 255, 162, 0.56)'  : item.status_limpeza === 'Em Limpeza' ? 'rgba(42, 42, 241, 0.81)' : 'rgba(241, 130, 130, 0.5)', borderRadius : 5, marginLeft : 5, marginTop : 5, 
                                        fontFamily : 'NotoSansRegular'}}>
                                        {item.status_limpeza}
                                    </Text>
                                </View>
                            </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
};

   

    return (
        <View style={{flex : 1}}>
            <View style={style.headerAdd}>
                <TextInput style={{width : '55%', paddingHorizontal : 5, marginRight : 10, backgroundColor : 'rgba(146, 146, 146, 0.5)', borderRadius : 20}} placeholder="Procure por uma sala" value={search} onChangeText={setSearch}></TextInput>
                <TouchableOpacity style = {style.mostrarModal} onPress={mostrarModal}>
                    <Text style={style.buttonAdd}>+</Text>
                </TouchableOpacity>

                
            </View>
                <FlatList
                data={SalasFiltradas}
                key={1}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderizarSala}
                nestedScrollEnabled={true}
                />
        </View>  
    )
}

const style = StyleSheet.create({

    headerAdd : {
        marginTop : 20,
        justifyContent:"space-around",
        paddingTop : 10,
        paddingBottom : 10,
        flexDirection : 'row'
        
    },
    mostrarModal : {
        backgroundColor : '#004A8D',
        borderRadius : 50,
        paddingLeft : 15,
        paddingRight : 15,
        marginRight : 10
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

