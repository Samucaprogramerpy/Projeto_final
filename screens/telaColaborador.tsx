import { Text, View, StyleSheet, FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { CarregarSalas } from "../types/salas"
import { criarSalas, obterSalas } from "../services/servicoSalas"


function telaColaborador(){
    const [salas, setSalas] = useState<CarregarSalas[]>([])
        const [carregando, setCarregando] = useState(true)

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
    });

    const renderizarSala = ({item} : {item: CarregarSalas}) => (
            <View style={style.CardSala}>
                <Text>{item.nome_numero}</Text>
                <Text>{item.capacidade}</Text>
                <Text>{item.localizacao}</Text>
                <Text>{item.descricao}</Text>
            </View>
        );
    return(
        <>
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

export default telaColaborador;

const style = StyleSheet.create({
    cabecalho : {
        justifyContent : 'space-around'
    },
    centralizado : {
        flexGrow : 1,
        alignItems : 'center',
    },
    CardSala : {
        backgroundColor : "white",
        borderRadius : 10,
        padding : 10,
        margin : 10,
        alignItems : 'center',
        height : 180,
        width : 143
    },
})