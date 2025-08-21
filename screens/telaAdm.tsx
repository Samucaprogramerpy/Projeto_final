import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"


interface telaColaboradorProps {
    aoLogout : () => void
}


export default function Admin ({aoLogout} : telaColaboradorProps) {
    return(
         <View>
            <TouchableOpacity onPress={aoLogout}>
                <Image style={style.logout} source={require("../img/logout.png")}></Image>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    logout : {
        height : 30,
        width : 30,
        marginRight : 10,
        marginTop : 10
    }
})