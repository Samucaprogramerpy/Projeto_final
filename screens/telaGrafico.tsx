import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { CarregarSalas } from '../types/salas';
import { useState } from 'react';
import { obterSalas, obterUsers } from '../services/servicoSalas';

const screenWidht = Dimensions.get('window').width

export default function GraficoPizza() {
    const [contagemLimpezas, setContagensLimpezas] = useState<[]>([])
    const [usuarios, setUsuarios] = useState<[string]>([''])
    const [carregando, setCarregando] = useState<boolean>(false)

    const CORES_FUNCIONARIOS = { 'senac': '#36A2EB', 'zelador': '#FF6384' };

    useFocusEffect (
        useCallback(() => {
            const CarregarSalas = async() => {
                const resposta = await obterSalas()
                const filter = resposta.map(item => item.ultima_limpeza_funcionario)
                const filtroNomes = filter.filter(nome => nome)
                
                const contagem = filtroNomes.reduce((contador, nomeAtual) => {
                    contador[nomeAtual] = (contador[nomeAtual] || 0) +1
                    return contador
                }, {})

                setContagensLimpezas(contagem)

            }

            CarregarSalas()
            const intervalo = setInterval(CarregarSalas, 60000)
            return () => clearInterval(intervalo)
        }, [])
    )


    const formatarDados = (dados : { [key : string] : number}) => {
            return Object.keys(dados).map(nome => (
                {
                    name : nome,
                    population : dados[nome],
                    color : CORES_FUNCIONARIOS[nome],
                    legendFontColor : '#333333',
                    legendFontSize : 14,
                }
            ))
        }
    const dadosDoGrafico = formatarDados(contagemLimpezas)



    interface dadosData {
        nomeUsuario : string
        QtdadeLimpezas : number
    }

    return (
        <View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
            <Text>Informações</Text>

            <PieChart
                data={dadosDoGrafico}
                width={screenWidht-40}
                height={220}
                chartConfig={{
                    backgroundColor: '#FFFFFF', // Cor base do gráfico
                    backgroundGradientFrom: '#F0F0F0', // Início do gradiente (cinza claro)
                    backgroundGradientTo: '#FFFFFF',   // Fim do gradiente (branco)
                    
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor das linhas/texto
                    style: {
                        borderRadius: 16
                    }
                }}
                accessor={"population"}
                backgroundColor={'transparent'}
                paddingLeft={"15"}
                absolute
            />
        </View>
    )
    
}