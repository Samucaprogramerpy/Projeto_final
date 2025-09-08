import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { obterSalasporID } from "../services/servicoSalas";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CarregarSalas } from "../types/salas";
import Load from "./telaLoad";
import api from "../api/api";

type DetalheSala = {
    IdSala : number
}

export default function TelaDetalhesSalas() {
    const rota = useRoute()
    const navigation = useNavigation()
    const {IdSala} = rota.params as DetalheSala
    const [sala, setSala] = useState<CarregarSalas | null>(null)
    const [carregando, setCarregando] = useState<boolean>(true)

    useEffect(() => {
        const CarregarDetalhesSalas = async () => {
            setCarregando(true)
            try {
                const SalaEncontrada = await obterSalasporID(IdSala)
                setSala(SalaEncontrada);

                const limpa = SalaEncontrada.status_limpeza

                if (limpa === 'Limpa'){
                    SalaEncontrada.isClean = true
                } else {
                    SalaEncontrada.isClean = false
                }
            } catch(error) {
                console.error("Erro ao encontrar Sala", error)
            } finally {
                setCarregando(false)
            }

        }
        CarregarDetalhesSalas()
    }, [IdSala])

    if (carregando) {
        <Load/>
    }

    return(
        <ScrollView>
            <TouchableOpacity style={{marginLeft : 10}} onPress={()=> navigation.navigate('adminSalas')}>
                <Text style={{padding : 10, backgroundColor : 'rgb(230, 229, 227)', width : 80, borderRadius : 5, textAlign : 'center'}}>{"< Voltar"}</Text>
            </TouchableOpacity>
            <View style={{marginLeft : 10}}>
                <Text>{sala?.nome_numero}</Text>
                <Text style={{color : sala?.isClean ? 'green' : 'red'}}>{<Text style={{color:'black'}}>Status:</Text>} {sala?.status_limpeza}</Text>
            </View>
        </ScrollView>
    )
}