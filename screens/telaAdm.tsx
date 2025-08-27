import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"


interface telaColaboradorProps {
    aoLogout : () => void
}


export default function Admin ({aoLogout} : telaColaboradorProps) {

    const navigation = useNavigation()
    return(
         <View style={style.container}>
            <View style={style.options}>
                <TouchableOpacity style={style.RangeLogout} onPress={() => navigation.navigate("adminSalas")}>
                    <Image style={style.logout} source={require("../img/salas.png")}></Image>
                    <Text style={style.textButton}>Salas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.RangeLogout} onPress={() => navigation.navigate("Users")}>
                    <Image style={style.logout} source={require("../img/user.png")}></Image>
                    <Text style={style.textButton}>Usuários</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    logout : {
        height : 50,
        width : 50,
    },
    container : {
        alignItems : "center"
    },
    options : {
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'space-around',
        marginTop : 50
    },
    RangeLogout : {
            padding : 30,
            backgroundColor : 'white',
            width : '35%',
            borderRadius : 10,
            alignItems : 'center',
            ...Platform.select({
                ios : {
                shadowColor : 'gray',
                shadowOffset : {
                width : 30, height : 30
                },
                shadowRadius : 5,
                shadowOpacity : 10
                },
                android : {
                    elevation : 5
                }
            })
            
            
        },
        textButton : {
            marginTop : 30,
            fontSize : 18
        }
})