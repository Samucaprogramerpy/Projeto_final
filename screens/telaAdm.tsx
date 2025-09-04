import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import api from "../api/api"
import { useEffect, useState, useCallback } from "react"
import CustomSwitch from "../services/Switch"
import { useFocusEffect } from "@react-navigation/native"


interface telaColaboradorProps {
    aoLogout : () => void
}



export default function Admin ({aoLogout} : telaColaboradorProps) {
    const [salasLimpas, setSalasLimpas] = useState('');
    const [on, setOn] = useState<boolean>(false)


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
                    <TouchableOpacity style={style.infoAdm} onPress={() => navigation.navigate("adminSalas")}>
                        <Text style={style.numSalasLimpas}>{salasLimpas}</Text>
                        <Text style={style.text}>Salas Limpas</Text>
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
        alignItems : 'flex-start',
    },
    infoAdm : {
        padding : 45,
        backgroundColor : '#004A8D',
        alignItems : 'center',
        borderRadius : 10
    },
    containerInfo : {
        alignItems : 'center',
        padding : 5,
        marginRight : 5,
    },
    text : {
        fontSize : 16,
        fontWeight : 'bold',
        marginTop : 20,
        padding : 5,
        backgroundColor : 'white',
        borderRadius : 50
    },
    numSalasLimpas : {
        color : 'white',
        fontSize : 20
    }
})