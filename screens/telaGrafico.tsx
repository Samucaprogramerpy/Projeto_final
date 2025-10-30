import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useState } from 'react';
import { CarregarUsuarios } from '../types/salas';
import { obterSalas, obterUsers } from '../services/servicoSalas';

const screenWidht = Dimensions.get('window').width

export default function GraficoPizza() {
    const [ultimaLimpeza, setUltimaLimpeza] = useState([])
    const [usuarios, setUsuarios] = useState<CarregarUsuarios[]>([])
    const [carregando, setCarregando] = useState<boolean>(false)

    useFocusEffect(
        useCallback(() => {
            obterUsers()

            const intervalo = setInterval(obterUsers, 30000)
            return () => clearInterval(intervalo);
        }, [])
    )


    const data = usuarios.map((user, index) => ({
        name : user.username,
        population : user.
    }))
}