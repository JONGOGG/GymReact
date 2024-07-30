import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CpButton from '../components/CpButton';
import logo from '../../assets/img/logo.jpg';  
import back from '../../assets/img/back2.jpg';

const LoginScreen = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://apirestgym-production-23c8.up.railway.app/login', {
        user,
        pass
      });

      if (response.status === 200) {
        const { token, rol } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userrol', rol);

        if (rol === 'admin') {
          navigation.navigate('Admin');
        } else {
          navigation.navigate('Client');
        }
      } else {
        Alert.alert('Login Error', 'Token invalido');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Hubo un error en el servidor.');
      console.error(error);
    }
  };

  return (
    <ImageBackground source={back} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.label}>nombre</Text>
        <TextInput
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          style={styles.input}
        />
        <Text style={styles.label}>Pass</Text>
        <TextInput
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          style={styles.input}
        />
        <CpButton title="Login" style={styles.button} onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },



  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%', 
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 190,
    opacity: 0.6,
  },
  input: {
    height: 40,
    width: '80%', // Ancho del 80%
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.6,
    borderRadius: 10,
  },
  label: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  
});

export default LoginScreen;
