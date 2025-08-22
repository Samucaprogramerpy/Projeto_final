import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native"




interface telaColaboradorProps {
    aoLogout : () => void
}

export default function Settings ({aoLogout} : telaColaboradorProps){
    return (
        <View style={style.container}>
                <View style={style.options}>
                    <TouchableOpacity style={style.RangeLogout} onPress={aoLogout}>
                        <Image style={style.logout} source={require("../img/logout.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={style.options}>
                    <TouchableOpacity style={style.RangeLogout} onPress={aoLogout}>
                        <Image style={style.logout} source={require("../img/logout.png")}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.RangeLogout} onPress={aoLogout}>
                        <Image style={style.logout} source={require("../img/logout.png")}></Image>
                    </TouchableOpacity>
                </View>
        </View> 
        

    )
}

const style = StyleSheet.create({
    container : {
        alignItems : 'center',
    },
    logout : {
        height : 50,
        width : 50,
    },
    RangeLogout : {
        padding : 30,
        backgroundColor : 'white',
        width : 100,
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
    options : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-around',
        marginTop : 50,
        width : '100%'
    }
})