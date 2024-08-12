import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Picker } from '@react-native-picker/picker';
import ReButton from '../components/ReButton';

const PerfilScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' o 'error'

  useEffect(() => {
    const fetchUserData = async () => {
      const AsyncUser = await AsyncStorage.getItem('userUser');
      try {
        const response = await axios.get(`https://apirestgym-production-23c8.up.railway.app/perfil/${AsyncUser}`);
        const data = response.data;

        setUsuario(data);
        setNombre(data.nombre);
        setApellidos(data.apellidos);
        setEmail(data.email);
        setTelefono(data.telefono);
        setSexo(data.sexo);
        setPeso(data.peso.toString());
        setEstatura(data.estatura.toString());
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const actualizarDatos = async () => {
    try {
      const AsyncUser = await AsyncStorage.getItem('userUser');
      await axios.put(`https://apirestgym-production-23c8.up.railway.app/actualizar_info/${AsyncUser}`, {
        telefono,
        peso,
        estatura,
      });
      setAlertMessage('Datos actualizados correctamente');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('Hubo un error al actualizar los datos');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const pesoOptions = Array.from({ length: 151 }, (_, i) => (i + 50).toString());
  const estaturaOptions = Array.from({ length: 71 }, (_, i) => (i + 130).toString());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Información Personal</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChangeText={setApellidos}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sexo</Text>
        <TextInput
          style={styles.input}
          placeholder="Sexo"
          value={sexo}
          onChangeText={setSexo}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Peso</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={peso}
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
            selectedValue={estatura}
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

      <ReButton title="Actualizar" style={styles.button} onPress={actualizarDatos} />

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertType === 'success' ? 'Éxito' : 'Error'}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={alertType === 'success' ? '#4CAF50' : '#F44336'}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});

export default PerfilScreen;
