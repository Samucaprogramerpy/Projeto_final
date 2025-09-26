import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import { CarregarSalas } from "../types/salas"
import { obterToken } from "../services/servicoTokken";
import { Ionicons } from '@expo/vector-icons';
import { Menu, MenuOption, MenuTrigger, MenuOptions } from "react-native-popup-menu";
import { obterSalas, obterSalasporID, obterUsers } from "../services/servicoSalas";
import api from "../api/api";
import { fi } from "date-fns/locale";

function TelaColaborador(){
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    const [carregando, setCarregando] = useState(true)
    const [grupo, setGrupo] = useState<boolean>()
    const [visivelid, setVisivelID] = useState<number | null>()
    const [usuario, setUsuario] = useState(null)


    const obterUser = async() => {
        const resposta = await api.get('accounts/current_user')
        const resposavel = resposta.data.username
        setUsuario(resposavel)
    
    }

    const comecarLimpeza = async (qr_code_id : any) => {
        try {
            const formData = new FormData()
            const token = await obterToken()
        

            formData.append('sala', qr_code_id)

            const resposta = await api.post(`salas/${qr_code_id}/iniciar_limpeza/`, formData)
            return resposta.status
        } catch(error) {
            console.error('Erro ao iniciar limpeza da sala', error)
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
                console.log(salas)
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



    const renderizarSala = ({item} : {item: CarregarSalas}) => (
                <View style={{alignItems : 'center'}}>
                    <View style={style.CardSala}>
                        <View style={{borderBottomWidth : 1, width : '100%', justifyContent : 'flex-end', flexDirection : 'row', borderBottomColor : '#004A8D'}}>
                            <View style={{width : '90%',  justifyContent : "center",flex : 1}}>
                                <Text style={{marginLeft : 5}}>{item.nome_numero}</Text>
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
                                            <Image style={{width : 25, height : 25}} source={require("../img/vassoura.png")}/>
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
                                {item.status_limpeza}
                            </Text>
                        </View>
                        {grupo ? (
                            <View/>
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
        <View>
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
        width : '100%',
        height : '88%'
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
    menu : {
        width : 50,
        alignItems : 'center'
    }
})