import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { obterSalasporID } from "../services/servicoSalas";
import { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CarregarSalas } from "../types/salas";
import { parseISO, format } from "date-fns"
import { ptBR } from "date-fns/locale"
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


    const displayLastCleanedTime = (utcDateTimeString: string | null): string => {
            if (!utcDateTimeString) {
              return "N/A";
            }
        
            try {
              const dateObjectUTC = parseISO(utcDateTimeString);
              
              return format(dateObjectUTC, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
        
            } catch (error) {
              console.error("Erro ao processar data/hora:", error);
              return "Data Inválida";
            }
    };

    useEffect(() => {
        const CarregarDetalhesSalas = async () => {
            setCarregando(true)
            try {
                const SalaEncontrada = await obterSalasporID(IdSala)
                const tempo = new Promise(resolve => setTimeout(resolve, 1000))
                const [carregar] = await Promise.all([SalaEncontrada, tempo])

                setSala(carregar);

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

    return(
        <View>
            {carregando ? (
                <View style={{justifyContent : 'center', width : '100%', height : '100%'}}>
                    <Load/>
                </View>
            ) : (
                <ScrollView  style={{marginTop : '3.5%' }}>
                    <TouchableOpacity style={{marginLeft : 10}} onPress={()=> navigation.navigate('adminSalas')}>
                        <Text style={{padding : 10, backgroundColor : 'rgb(230, 229, 227)', width : 80, borderRadius : 5, textAlign : 'center'}}>{"< Voltar"}</Text>
                    </TouchableOpacity>
                    <View style={{marginLeft : 10}}>
                        <Text style={{fontSize : 25, marginBottom : 20, marginTop : 15}}>{sala?.nome_numero}</Text>
                        <Text>Capacidade: {sala?.capacidade} pessoas</Text>
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                            <Text>Status:</Text>
                            <Text style={{color : sala?.isClean ? 'green' : 'red', backgroundColor : sala?.isClean ? 'rgba(155, 248, 155, 0.69)' : 'rgba(249, 167, 167, 0.53)', padding : 5, marginLeft : 5, borderRadius : 5 }}>{sala?.status_limpeza}</Text>
                        </View>
                    </View>
                    <Text style={{marginLeft : 10}}>Última Limpeza : {displayLastCleanedTime(sala?.ultima_limpeza_data_hora)}</Text>
                </ScrollView>
            )}
            
        </View>   
)}
    