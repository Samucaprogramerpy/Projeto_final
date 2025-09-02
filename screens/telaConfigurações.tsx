import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native"
import api from "../api/api"
import { useState, useEffect } from "react"



interface telaColaboradorProps {
    aoLogout : () => void
}




export default function Settings ({aoLogout} : telaColaboradorProps){
    const [user, setUser] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        const obterUser =async () => {
        try {
            const resposta = await api.get('accounts/current_user/')
            setUser(resposta.data.username)
            setStatus(resposta.data.is_superuser)
        } catch (error) {
            console.error("Erro ao obter usuário")
        }
    }
    obterUser()
    })
    return (
        
        <View style={style.container}>
                <View style={style.options}>
                    <Image style={style.user} source={require("../img/user.png")}/>
                    <Text style={style.nomeUser}>{user}</Text>
                    <View style={style.infosUser}>
                        <View style={style.texts}>
                            <Text>Status : {status ? 'admin' : 'usuario'}</Text>
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
        width : 80,
        height : 80
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
        height : 200,
        backgroundColor : 'white',
        borderRadius : 10
    },
    texts : {
        marginTop : 40,
        marginLeft : 8
    }

})