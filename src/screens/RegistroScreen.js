import React, { useState } from 'react';
import { View, TextInput, SafeAreaView, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ReButton from '../components/ReButton';
import AwesomeAlert from 'react-native-awesome-alerts';

const RegistroScreen = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [tipo_usuario, setTipoUsuario] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://apirestgym-production-23c8.up.railway.app/registro', {
        nombre,
        apellidos,
        email,
        telefono,
        sexo,
        peso,
        estatura,
        tipo_usuario,
        user,
        pass
      });

      if (response.status === 200) {
        const { title, alertMessage } = response.data;
        setAlertTitle(title);
        setAlertMessage(alertMessage);
        setAlertType('success');
      } else {
        setAlertTitle('Registro Error');
        setAlertMessage('Hubo un error durante el registro.');
        setAlertType('error');
      }
    } catch (error) {
      setAlertTitle('Registro Error');
      setAlertMessage('Hubo un error en el servidor.');
      setAlertType('error');
      console.error(error);
    } finally {
      setShowAlert(true);
    }
  };

  const pesoOptions = Array.from({ length: 151 }, (_, i) => (i + 50).toString());
  const estaturaOptions = Array.from({ length: 71 }, (_, i) => (i + 130).toString());

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ImageBackground
          source={require('../../assets/img/espal2.jpeg')}
          style={styles.imageBackground}
        />
        <View style={styles.overlay} />
        <View style={styles.container}>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingrese su nombre"
            style={styles.input}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <TextInput
            value={apellidos}
            onChangeText={setApellidos}
            placeholder="Ingrese sus apellidos"
            style={styles.input}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su email"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <TextInput
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Ingrese su teléfono"
            style={styles.input}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sexo}
              onValueChange={(itemValue) => setSexo(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona tu sexo:" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={peso}
              onValueChange={(itemValue) => setPeso(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Peso..." value="" />
              {pesoOptions.map(peso => (
                <Picker.Item key={peso} label={peso} value={peso} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={estatura}
              onValueChange={(itemValue) => setEstatura(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Estatura..." value="" />
              {estaturaOptions.map(estatura => (
                <Picker.Item key={estatura} label={estatura} value={estatura} />
              ))}
            </Picker>
          </View>
          <TextInput
            value={user}
            onChangeText={setUser}
            placeholder="Ingrese su usuario"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <TextInput
            value={pass}
            onChangeText={setPass}
            placeholder="Ingrese su contraseña"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="rgba(0, 0, 0, 0.7)"
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo_usuario}
              onValueChange={(itemValue) => setTipoUsuario(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Rol: Usuer/Admin" value="" />
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Client" value="client" />
            </Picker>
          </View>
          <ReButton title="Registrar" style={styles.button} onPress={handleRegister} />
        </View>
      </ScrollView>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#9aa1a1',
  },
  imageBackground: {
    height: 150,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 150, // Posiciona el overlay justo debajo de la imagen
    left: 0,
    right: 0,
    height: 9, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5, 
    zIndex: 1, 
    opacity: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    marginTop: 25,
    zIndex: 2, 
  },
  input: {
    height: 60,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    opacity: 0.8,
    fontWeight: 'bold',
  },
  label: {
    color: 'white',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  pickerContainer: {
    height: 60,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    opacity: 0.8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#FFFFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistroScreen;
