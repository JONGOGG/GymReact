import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import CpButton from '../components/CpButton';
import logo from '../../assets/img/logo.jpg';  
import back from '../../assets/img/back2.jpg';

const LoginScreen = () => {
  // Estado para manejar la información del usuario y la contraseña
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  // Estado para mostrar u ocultar la alerta y manejar su contenido
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  // Hook de navegación para redirigir al usuario después del login
  const navigation = useNavigation();

  // Función para manejar el proceso de login
  const handleLogin = async () => {
    // Verificar que el usuario y la contraseña no estén vacíos
    if (!user || !pass) {
      setAlertTitle('Error');
      setAlertMessage('Usuario y contraseña son requeridos.');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    try {
      // Enviar solicitud POST al servidor para autenticación
      const response = await axios.post('https://apirestgym-production-23c8.up.railway.app/login', {
        user,
        pass
      });

      // Manejar diferentes respuestas del servidor
      switch (response.status) {
        case 200:
          const { token, rol, usuario } = response.data;
          // Guardar el token y rol en AsyncStorage
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userrol', rol);
          await AsyncStorage.setItem('userUser', usuario);
          // Redirigir según el rol del usuario
          navigation.navigate(rol === 'admin' ? 'Admin' : 'Client');
          break;
        case 204:
          setAlertTitle('Error');
          setAlertMessage('Usuario no encontrado');
          setAlertType('error');
          setShowAlert(true);
          break;
        case 401:
          setAlertTitle('Error');
          setAlertMessage('Contraseña incorrecta');
          setAlertType('error');
          setShowAlert(true);
          break;
        case 400:
        default:
          setAlertTitle('Error');
          setAlertMessage('Datos inválidos o error inesperado');
          setAlertType('error');
          setShowAlert(true);
          break;
      }
    } catch (error) {
      // Manejo de errores en la solicitud
      if (error.response) {
          const { status, data } = error.response;
          if (status === 401) {
              setAlertTitle('Error');
              setAlertMessage(data.alertMessage || 'Contraseña incorrecta');
              setAlertType('error');
          } else {
              setAlertTitle('Error');
              setAlertMessage(data.alertMessage || 'Error inesperado.');
              setAlertType('error');
          }
      } else if (error.request) {
          setAlertTitle('Error');
          setAlertMessage('No se pudo conectar al servidor.');
      } else {
          setAlertTitle('Error');
          setAlertMessage('Hubo un error.');
      }
      setShowAlert(true);
    }
  };

  // Función para obtener los estilos de la alerta según su tipo
  const getAlertStyles = () => {
    switch (alertType) {
      case 'success':
        return {
          titleStyle: styles.successTitle,
          messageStyle: styles.successMessage,
          cancelButtonStyle: styles.successCancelButton,
        };
      case 'warning':
        return {
          titleStyle: styles.warningTitle,
          messageStyle: styles.warningMessage,
          cancelButtonStyle: styles.warningCancelButton,
        };
      case 'error':
      default:
        return {
          titleStyle: styles.errorTitle,
          messageStyle: styles.errorMessage,
          cancelButtonStyle: styles.errorCancelButton,
        };
    }
  };

  // Desestructurar los estilos de alerta
  const { titleStyle, messageStyle, cancelButtonStyle } = getAlertStyles();

  return (
    <ImageBackground source={back} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Mostrar el logo */}
        <Image source={logo} style={styles.logo} />
        {/* Campo de entrada para el usuario */}
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          style={styles.input}
        />
        {/* Campo de entrada para la contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          style={styles.input}
        />
        {/* Botón de inicio de sesión */}
        <CpButton title="Login" style={styles.button} onPress={handleLogin} />
        {/* Componente de alerta para mostrar mensajes de error o éxito */}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="OK"
          cancelButtonColor="#DD6B55"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          titleStyle={titleStyle}
          messageStyle={messageStyle}
          cancelButtonStyle={cancelButtonStyle}
        />
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
    width: '80%',
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
  errorTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorMessage: {
    color: 'black',
    fontSize: 16,
  },
  successTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  successMessage: {
    color: 'white',
    fontSize: 16,
  },
  warningTitle: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 18,
  },
  warningMessage: {
    color: 'orange',
    fontSize: 16,
  },
  errorCancelButton: {
    backgroundColor: 'red',
  },
  successCancelButton: {
    backgroundColor: 'green',
  },
  warningCancelButton: {
    backgroundColor: 'orange',
  },
});

export default LoginScreen;
