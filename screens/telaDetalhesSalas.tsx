import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { obterSalasporID } from "../services/servicoSalas";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CarregarSalas } from "../types/salas";
import Load from "./telaLoad";

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
    if (!sala) {
        console.error('Sala não encontrada!')
    }

    return(
        <ScrollView>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Text>{"< Voltar"}</Text>
                <Text>{sala?.nome_numero}</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
