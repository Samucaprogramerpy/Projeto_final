import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import api from "../api/api"
import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"


interface telaColaboradorProps {
    aoLogout : () => void
}



export default function Admin ({aoLogout} : telaColaboradorProps) {
    const [salasLimpas, setSalasLimpas] = useState('');


    const contarSalas  = async () => {
        try {
            const resposta  = await api.get('salas/')
            const data = resposta.data

            const filtragem = data.filter(sala => sala.status_limpeza === 'Limpa')
            setSalasLimpas(filtragem.length)
        } catch (error) {
            console.error("Erro ao recuperar as salas!", error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            contarSalas()
        }, [])
    )


    const navigation = useNavigation()
    return(
         <View style={style.container}>
            <View style={style.options}>
                <View style={style.containerInfo}>
                    <Text style={style.text}>Salas Limpas</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("adminSalas")}>
                        <Text style={style.infoAdm}>{salasLimpas}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container : {
        alignItems : "center"
    },
    options : {
        flexDirection : 'column',
        width : '100%',
        marginTop : 50,
        alignItems : 'flex-end'
    },
    infoAdm : {
        padding : 20,
        width : 100,
        backgroundColor : '#004A8D',
        color : 'white',
        fontSize : 18,
        fontWeight : 'bold',
        borderRadius : 5,
        paddingLeft : 30,
        paddingRight : 30,
        textAlign : 'center'
    },
    containerInfo : {
        alignItems : 'center',
        padding : 5,
        marginRight : 5
    },
    text : {
        fontSize : 16,
        fontWeight : 'bold'
    }
})