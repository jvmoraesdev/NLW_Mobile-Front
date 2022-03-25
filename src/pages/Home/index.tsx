import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import api from '../../services/api';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface pickerItem {
  label: string;
  value: string;
}


const Home = () => {
  const [uf, setUf] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const navigation = useNavigation();
  const [fillUf, setFillUf] = useState<pickerItem[]>([{
    label: "",
    value: "",

  }]);
  const [fillCity, setFillCity] = useState<pickerItem[]>([{
    label: "",
    value: "",
  }]);
  const [selectedUf, setSelectedUf] = useState('0');


  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCity(cityNames);

        const fillCity = cityNames.map(city => {
          return ({
            label: city,
            value: city,
          });
        });
        setFillCity(fillCity);
      });
  }, [selectedUf]);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla)
      setUf(ufInitials);

      const fillUfs = ufInitials.map(uf => {
        return (
          {
            label: uf,
            value: uf
          }
        );
      });
      setFillUf(fillUfs);
    });

  }, []);

  function handleNavigateToPoint() {
    navigation.navigate('Points', {
      uf,
      city,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >

        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de formas eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            placeholder={{ label: 'Selecione um estado', value: '' }}
            onValueChange={(value) =>
              setSelectedUf(value)
            }
            value={selectedUf}
            items={fillUf}
          />

          <RNPickerSelect
            placeholder={{ label: 'Selecione uma cidade', value: '' }}
            onValueChange={() => console.log()}
            items={fillCity}
          />

          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
            onChangeText={setUf}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={setCity}
          /> */}


          <RectButton style={styles.button} onPress={() => { handleNavigateToPoint() }}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;