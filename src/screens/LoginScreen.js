import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CpButton from '../components/CpButton';

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
        Alert.alert('Login Error', 'Tken invalido');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Hubo un error en el servidor.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <CpButton title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
