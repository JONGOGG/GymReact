import React, { useState } from 'react';
import { View, TextInput, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import ReButton from '../components/ReButton';

const UpdateUserScreen = ({ route, navigation }) => {
  const { user } = route.params;

  const [nombre, setNombre] = useState(user.nombre);
  const [apellidos, setApellidos] = useState(user.apellidos);
  const [email, setEmail] = useState(user.email);
  const [telefono, setTelefono] = useState(user.telefono);
  const [peso, setPeso] = useState(user.peso);
  const [estatura, setEstatura] = useState(user.estatura);
  const [userr, setuserr] = useState(user.user);
  const [pass, setpass] = useState(user.pass);

  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleUpdateUser = async () => {
    try {
      const userName = user.user;
      const url = `https://apirestgym-production-23c8.up.railway.app/actualizar/${userName}`;
      console.log('Request URL:', url);

      const response = await axios.put(url, {
        nombre,
        apellidos,
        email,
        telefono,
        peso: parseFloat(peso),
        estatura: parseFloat(estatura),
        user: userr,
        pass,
      });

      console.log('Response Data:', response.data);

      if (response.data && response.data.message) {
        const message = response.data.message.toLowerCase();
        if (message.includes('actualizado correctamente')) {
          setAlertTitle('Éxito');
          setAlertMessage(response.data.message);
          setAlertType('success');
        } else {
          setAlertTitle('Error');
          setAlertMessage(response.data.message);
          setAlertType('error');
        }
      } else {
        setAlertTitle('Error');
        setAlertMessage('No se pudo actualizar el usuario');
        setAlertType('error');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error del servidor:', error.response.data);
        setAlertTitle('Error del Servidor');
        setAlertMessage(error.response.data.message || 'Ocurrió un error');
        setAlertType('error');
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        setAlertTitle('Error de Red');
        setAlertMessage('No se pudo conectar con el servidor');
        setAlertType('error');
      } else {
        console.error('Error al realizar la solicitud:', error.message);
        setAlertTitle('Error');
        setAlertMessage('No se pudo actualizar el usuario');
        setAlertType('error');
      }
    } finally {
      setShowAlert(true);
    }
  };

  
  const handleAlertConfirm = () => {
    setShowAlert(false);
    navigation.goBack();
  };

  const pesoOptions = Array.from({ length: 151 }, (_, i) => (i + 50).toString());
  const estaturaOptions = Array.from({ length: 71 }, (_, i) => (i + 130).toString());

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.planHeader}>
          <View style={styles.headerOverlay}>
            <Text style={styles.planTitle}>ACTUALIZA TU PERFIL</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellidos</Text>
            <TextInput
              style={styles.input}
              value={apellidos}
              onChangeText={setApellidos}
              placeholder="Apellidos"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peso</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={peso.toString()}
                onValueChange={(itemValue) => setPeso(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Peso..." value="" />
                {pesoOptions.map((peso) => (
                  <Picker.Item key={peso} label={peso} value={peso} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estatura</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={estatura.toString()}
                onValueChange={(itemValue) => setEstatura(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Estatura..." value="" />
                {estaturaOptions.map((estatura) => (
                  <Picker.Item key={estatura} label={estatura} value={estatura} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              value={userr}
              onChangeText={setuserr}
              placeholder="Usuario"
              autoCapitalize="none"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={pass}
              onChangeText={setpass}
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>

          <ReButton title="Actualizar Usuario" style={styles.button} onPress={handleUpdateUser} />
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
        confirmButtonColor={alertType === 'success' ? '#28a745' : '#dc3545'}
        onConfirmPressed={handleAlertConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  planHeader: {
    position: 'relative',
    marginBottom: 20,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateUserScreen;
