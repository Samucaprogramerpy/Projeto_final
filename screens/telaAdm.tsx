import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import api from "../api/api"
import { useEffect, useState, useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"





export default function Admin () {
    const [salasLimpas, setSalasLimpas] = useState('');
    const [salasSujas, setSalasSujas] = useState('');


    const contarSalas  = async () => {
        try {
            const resposta  = await api.get('salas/')
            const data = resposta.data

            const filtragem = data.filter(sala => sala.status_limpeza === 'Limpa')
            const filtro_naolimpas = data.filter(sala => sala.status_limpeza === 'Limpeza Pendente')

            setSalasSujas(filtro_naolimpas.length)
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
                <View style={style.containerInfo}>
                    <TouchableOpacity style={style.infoAdm} onPress={() => navigation.navigate("adminSalas", {tipo : "A"})}>
                        <Text style={style.numSalasLimpas}>{salasLimpas}</Text>
                        <Text style={style.text}>Salas Limpas</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.containerInfo}>
                    <TouchableOpacity style={{backgroundColor : '#F7941D', padding : 25, paddingVertical : 72, alignItems : 'center', borderRadius : 10}} onPress={() => navigation.navigate("adminSalas", {tipo : "B"})}>
                        <Text style={style.numSalasLimpas}>{salasSujas}</Text>
                        <Text style={style.text}>Salas náo {'\n'} Limpas</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}

const style = StyleSheet.create({
    container : {
        flexDirection : 'row',
        justifyContent : 'space-around'
    },
    infoAdm : {
        paddingVertical : 80,
        padding : 20,
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
        borderRadius : 20
    },
    numSalasLimpas : {
        color : 'white',
        fontSize : 20
    }
})