import { Text, View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ImageBackground, ActivityIndicator} from "react-native";
import { useState } from "react";
import { realizarLogin } from "../services/servicoAutenticacao";
import { salvarToken } from "../services/servicoTokken";

interface telaLoginProps{
    aoLoginSucesso: () => void;
}

const image = require('../img/senac.jpg')



export default function TelaLogin({aoLoginSucesso} : telaLoginProps)  {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [carregando, setCarregando] = useState(false)
    const [Erro, setErro] = useState('');

    const Login = async () => {
        setCarregando(true);
        setErro('');
        try {
            const resposta = await realizarLogin({usuario : login, senha : password});
            await salvarToken(resposta.token); 
            aoLoginSucesso() 
        } catch (erro : any) {
            console.log(erro)
            setErro(erro.mensage || 'Erro inesperado. Tente Novamente');
        } finally {
            setCarregando(false);
        }
    };
    return(
            <ImageBackground source={image} style={style.background}>
                <View style={style.geral}>
                    <KeyboardAvoidingView behavior="padding" style={style.container}>
                        <View style={style.child}>
                            <View style={style.controls}>
                                <TextInput style={style.input} placeholder="Insira o ID" value={login} onChangeText={setLogin}></TextInput>
                            </View>
                            <View style ={style.controls}>
                                <TextInput style={style.input}
                                placeholder="Digite a senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry 
                                />
                            </View>
                            {carregando ? (
                                <ActivityIndicator size="large"/>
                            ) : (
                                <View style={style.viewBotao}>
                                    <TouchableOpacity onPress={Login} style={style.botao}>
                                        <Text style ={style.TextoBotao}>
                                            Continuar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {Erro ? <Text>{Erro}</Text> : null}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ImageBackground>
    );
}

const style = StyleSheet.create({
    geral : {
        width : "100%",
        flex : 1,
        backgroundColor : 'rgba(17, 0, 0, 0.6)',
    },
    background : {
        flex : 1,
        resizeMode : 'center',
        justifyContent : 'center',
        alignItems : 'center',
        width : 'auto',
        height : 'auto'

    },
    container : {
        margin : 'auto',
        width : 300,
        paddingTop : 30,
        paddingBottom : 30,
        justifyContent : 'center',
        borderRadius : 15,
        flexDirection : 'column',
        backgroundColor : 'rgba(17,0,0,0.3)'
    },
    child : {
        paddingBottom : 50,
    },
    text : {
        color : 'white'
    },
    input : {
        borderWidth: 1,
        backgroundColor : 'white',
        padding : 15,
        borderRadius : 15,
        color : 'black',
        height : 45,
        fontSize : 12

    },
    controls : {
        padding : 20
    },
    viewBotao : {
        alignItems : 'center',
        marginTop : 30,
        width : 100,
        padding : 10,
        margin : 'auto',
        borderRadius : 10,
        backgroundColor  : '#004A8D',
    },
    botao : {
        borderRadius : 5,
        width : 'auto',
        
    },
    TextoBotao : {
        color : 'white'
    },
    Erro : {
        color : 'white'
    }
});

