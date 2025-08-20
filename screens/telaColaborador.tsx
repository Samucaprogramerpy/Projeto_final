import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";

interface telaColaboradorProps {
    aoLogout : () => void
}

function telaColaborador({aoLogout}: telaColaboradorProps){

    return(
            <View>
                <TouchableOpacity onPress={aoLogout}>
                    <Image source={require("../img/logout.png")}></Image>
                </TouchableOpacity>
            </View>

    )
}

export default telaColaborador;