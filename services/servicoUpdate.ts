import AsyncStorage from "@react-native-async-storage/async-storage";

const VALOR = 'status:boolean'

export const setValor = async(status : boolean) => {
    const newStatus = JSON.stringify(status)
    await AsyncStorage.setItem(VALOR, newStatus)
}

export const getValor = async() => {
    const resposta = await AsyncStorage.getItem(VALOR)
    return resposta
}