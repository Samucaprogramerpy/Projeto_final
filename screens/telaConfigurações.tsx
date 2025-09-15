import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native"
import api from "../api/api"
import { useState, useEffect } from "react"



interface telaColaboradorProps {
    aoLogout : () => void
}



export default function Settings ({aoLogout} : telaColaboradorProps){
    const [user, setUser] = useState('')
    const [status, setStatus] = useState('')
    const [imagem, setimagem] = useState<any | null>(null)
    const [fotoPerfil, setFotoPerfil] = useState<boolean>(false)

    useEffect(() => {
        const obterUser =async () => {
        try {
            const resposta = await api.get('accounts/current_user/')
            setUser(resposta.data.username)
            setStatus(resposta.data.is_superuser)
            setimagem(resposta.data.profile.profile_picture)
        } catch (error) {
            console.error("Erro ao obter usuário")
        }
    }
    obterUser()
    })
    return (
        
        <View style={style.container}>
            <View style={{height : 100, alignItems : 'flex-start', width : '100%', backgroundColor : 'transparent', justifyContent : 'center', borderBottomWidth : 1, borderBottomColor : '#F7941D'}}>
                <Text style={{marginLeft : 10, fontSize : 26, fontWeight : 'bold', color : '#004A8D'}}>
                    Configurações
                </Text>
            </View>
                <View style={style.options}>
                    {fotoPerfil ? (
                        <Image style={style.user} source={{uri: `https://zeladoria.tsr.net.br/${imagem}`}}/>
                    ) : (
                        <TouchableOpacity>
                            <Image style={{opacity:0.3}} source={require('../img/camera.png')}/>
                        </TouchableOpacity>
                    )}
                    
                    <Text style={style.nomeUser}>{user}</Text>
                    <View style={style.infosUser}>
                        <View style={style.texts}>
                            <Text>Status : {status ? 'Adminstrador' : 'Usuário'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={style.RangeLogout} onPress={aoLogout}>
                        <Image style={style.logout} source={require("../img/logout.png")}></Image>
                    </TouchableOpacity>
                </View>
        </View> 
        

    )
}

const style = StyleSheet.create({
    container : {
        alignItems : 'center',
    },
    user : {
        width : 100,
        height : 100,
        borderRadius : 50
    },
    logout : {
        height : 50,
        width : 50,
    },
    RangeLogout : {
        alignItems : 'center',
    },
    options : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'space-around',
        marginTop : 50,
        width : '100%',
        alignItems : 'center',
    },
    nomeUser : {
        marginBottom : 20,
        fontSize : 20,
        fontWeight : 'bold'
    },
    infosUser : {
        width : '90%',
        alignItems : 'flex-start',
        height : 50,
        backgroundColor : 'white',
        borderRadius : 10,
        justifyContent : 'center'
    },
    texts : {
        marginLeft : 10
    }

})