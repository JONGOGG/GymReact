import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
  const [estado_suscripcion, setEstadoSuscripcion] = useState('');
  const [dias_suscripcion, setDiasSuscripcion] = useState('');
  const [tipo_rutina, setTipoRutina] = useState('');
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

  // Listas de opciones para los selectores de peso y estatura
  const pesoOptions = Array.from({ length: 151 }, (_, i) => (i + 50).toString());
  const estaturaOptions = Array.from({ length: 71 }, (_, i) => (i + 130).toString());

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            value={apellidos}
            onChangeText={setApellidos}
            style={styles.input}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            value={telefono}
            onChangeText={setTelefono}
            style={styles.input}
          />
          <Text style={styles.label}>Sexo</Text>
          <Picker
            selectedValue={sexo}
            onValueChange={(itemValue) => setSexo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Femenino" value="Femenino" />
          </Picker>
          <Text style={styles.label}>Peso (kg)</Text>
          <Picker
            selectedValue={peso}
            onValueChange={(itemValue) => setPeso(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione..." value="" />
            {pesoOptions.map(peso => (
              <Picker.Item key={peso} label={peso} value={peso} />
            ))}
          </Picker>
          <Text style={styles.label}>Estatura (cm)</Text>
          <Picker
            selectedValue={estatura}
            onValueChange={(itemValue) => setEstatura(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione..." value="" />
            {estaturaOptions.map(estatura => (
              <Picker.Item key={estatura} label={estatura} value={estatura} />
            ))}
          </Picker>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
            style={styles.input}
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            style={styles.input}
          />
          <Text style={styles.label}>Tipo de Usuario</Text>
          <Picker
            selectedValue={tipo_usuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione..." value="" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Client" value="client" />
          </Picker>
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
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    padding: 16,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
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
    color: 'Black',
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: 'white',
    opacity: 0.6,
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'white',
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
