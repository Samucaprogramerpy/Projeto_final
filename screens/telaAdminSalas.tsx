import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, FlatList, Modal } from "react-native"
import { useState, useEffect } from "react"
import { CarregarSalas } from "../types/salas"
import { criarSalas, obterSalas } from "../services/servicoSalas"




export default function Salas () {
    const [carregando, setCarregando] = useState(true)
    const [salas, setSalas] = useState<CarregarSalas[]>([])
      const [visivel, setVisivel] = useState(false)

      
    const mostrarModal = () => {
        setVisivel(!visivel)
  }
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


    return (
        <>  
            <Modal 
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={mostrarModal}>
                <View style={style.containerModal}>
                    <View style={style.modal}>
                        <TouchableOpacity onPress={mostrarModal}>
                            <Text>
                                ola
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={style.headerAdd}>
                <TouchableOpacity onPress={mostrarModal}>
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
        width : 143
    },
    centralizado : {
        flexGrow : 1,
        alignItems : 'center',
        marginTop : 30
    },
    modal : {
        padding : 30,
        backgroundColor : 'white',
        width : 300,
        height : 430,
        flexDirection : 'column',
        alignItems : 'center'
    },
    containerModal : {
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1,
    }
});

