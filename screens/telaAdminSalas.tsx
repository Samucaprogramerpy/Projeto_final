import 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ScrollView } from "react-native"
import { useState, useEffect } from "react"
import { CarregarSalas } from "../types/salas"
import { obterSalas } from "../services/servicoSalas"




export default function Salas () {
    const [carregando, setCarregando] = useState(true)
    const [salas, setSalas] = useState<CarregarSalas[]>([])
    useEffect(() => {
        
        
        
        const carregarSalas = async () => {
            setCarregando(true);
            try{
                const Salas = await obterSalas()
                setSalas(Salas)
            } catch (error) {
                console.error('Não foi possivel carregar os produtos', error)
            } finally {
                setCarregando(false)
            }
        };
        carregarSalas()
    })
    
    const renderizarSala = ({item} : {item: CarregarSalas}) => (
            <View style={style.CardSala}>
                <Text>{item.nome_numero}</Text>
                <Text>{item.capacidade}</Text>
                <Text>{item.localizacao}</Text>
                <Text>{item.descricao}</Text>
            </View>
    );


    return (
        <>
            <View style={style.headerAdd}>
                <TouchableOpacity>
                    <Image source={require("../img/add.png")}/>
                </TouchableOpacity>

                
            </View>
                <FlatList
                data={salas}
                keyExtractor={(item) => item.nome_numero.toString()}
                numColumns={2}
                renderItem={renderizarSala}
                contentContainerStyle={style.centralizado}
                nestedScrollEnabled={true}
                />
        </>
    )
}

const style = StyleSheet.create({

    headerAdd : {
        alignItems : 'flex-end',
        marginTop : 15
    },
    CardSala : {
        backgroundColor : "white",
        borderRadius : 10,
        padding : 10,
        margin : 10,
        alignItems : 'center',
        height : 180,
        width : 180
    },
    centralizado : {
        flexGrow : 1,
        alignItems : 'center',
        marginTop : 30
    }
})
