import { Text, View, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";

interface telaLoginProps{
    aoLoginSucesso: () => void;
}


export default function telaLogin() {
    return(
    <View style = {style.pai}>
        <View style={style.container}>
            <View style={style.controls}>
                <Text>ID</Text>
                <TextInput style={style.input}></TextInput>
            </View>
            <View style ={style.controls}>
                <Text>Senha</Text>
                <TextInput style={style.input}></TextInput>
            </View>
            <View style={style.viewBotao}>
                <TouchableOpacity style={style.botao}>
                    <Text>
                        Continuar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    )
}

const style = StyleSheet.create({
    pai : {
        flex : 1
    },
    container : {
        margin : 'auto',
        width : '30%',
        height : '45%',
        borderWidth : 1,
        padding : 30,
        justifyContent : 'center',
        borderRadius : 5,
        backgroundColor : 'white',
    },
    input : {
        borderWidth: 1,
        backgroundColor : 'white',
        borderRadius : 5
    },
    controls : {
        padding : 20
    },
    viewBotao : {
        alignItems : 'center',
        marginTop : 30,
        backgroundColor  : '#004A8D',
    },
    botao : {
        borderRadius : 5,
        width : 'auto',
        
    }
})