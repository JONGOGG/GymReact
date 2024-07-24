import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CpButton from '../components/CpButton';
import logo from '../../assets/img/logo.jpg';  
import back from '../../assets/img/back2.jpg';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users', {
        username,
        password
      });

      if (response.status === 200) {
        const { token, role } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', role);

        if (role === 'admin') {
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
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
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
