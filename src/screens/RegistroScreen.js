import React, { useState } from 'react';
import { View, TextInput, SafeAreaView, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ReButton from '../components/ReButton';
import AwesomeAlert from 'react-native-awesome-alerts';
import rutinas from '../../assets/img/registro.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userrol');
    await AsyncStorage.removeItem('userUser');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleRegister = async () => {
    if (isSubmitting) return;

    // Validaciones
    if (!nombre || !apellidos || !email || !telefono || !sexo || !peso || !estatura || !user || !pass || !tipo_usuario) {
      setAlertTitle('Error de validación');
      setAlertMessage('Todos los campos son obligatorios.');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    // Validar email con dominios permitidos
  const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
  if (!emailRegex.test(email)) {
    setAlertTitle('Error de validación');
    setAlertMessage('Ingrese un email válido con dominios @gmail.com, @yahoo.com, o @outlook.com.');
    setAlertType('error');
    setShowAlert(true);
    return;
  }


    // Validar teléfono
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(telefono)) {
      setAlertTitle('Error de validación');
      setAlertMessage('Ingrese un número de teléfono válido (10 dígitos).');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const AsyncUser = await AsyncStorage.getItem('userUser');
      const tokens = await AsyncStorage.getItem('userToken');
      // Configuración de los headers
      const header = {
        headers: {
          'x-access-token': `${tokens}`,  
          'Content-Type': 'application/json',  
    
        }
      };

      const response = await axios.post(`https://apirestgym-production-23c8.up.railway.app/registro/${AsyncUser}`, {
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
      },
      header  
    );
    console.log('Respuesta:', response);  

      if (response.status === 200) {
        const { title, alertMessage } = response.data;
        setAlertTitle(title);
        setAlertMessage(alertMessage);
        setAlertType('success');
        // Solo limpiar los campos si el registro es exitoso
        setNombre('');
        setApellidos('');
        setEmail('');
        setTelefono('');
        setSexo('');
        setPeso('');
        setEstatura('');
        setUser('');
        setPass('');
        setTipoUsuario('');
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
      setIsSubmitting(false);
      setShowAlert(true);
    }
  };

  const pesoOptions = Array.from({ length: 151 }, (_, i) => (i + 50).toString());
  const estaturaOptions = Array.from({ length: 71 }, (_, i) => (i + 130).toString());

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.planHeader}>
          <Image source={rutinas} style={styles.headerImage} />
          <View style={styles.headerOverlay}>
            <Text style={styles.planTitle}>DESARROLLA TU MEJOR VERSIÓN</Text>
            <Text style={styles.planDuration}>30 días</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingrese su nombre"
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellidos</Text>
            <TextInput
              value={apellidos}
              onChangeText={setApellidos}
              placeholder="Ingrese sus apellidos"
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese su email"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Ingrese su teléfono"
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={sexo}
                onValueChange={(itemValue) => setSexo(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona el sexo:" value="" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Femenino" value="Femenino" />
              </Picker>
            </View>
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
                {pesoOptions.map(peso => (
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
                {estaturaOptions.map(estatura => (
                  <Picker.Item key={estatura} label={estatura} value={estatura} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              value={user}
              onChangeText={setUser}
              placeholder="Ingrese su usuario"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              value={pass}
              onChangeText={setPass}
              placeholder="Ingrese su contraseña"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo_usuario}
                onValueChange={(itemValue) => setTipoUsuario(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona un rol..." value="" />
                <Picker.Item label="Administrador" value="Admin" />
                <Picker.Item label="Usuario" value="Client" />
              </Picker>
            </View>
          </View>
          <ReButton
            title="Registrar"
            style={styles.button}
            onPress={handleRegister}
            disabled={isSubmitting}
          />
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
        confirmButtonColor={alertType === 'success' ? '#4CAF50' : '#F44336'}
        onConfirmPressed={() => setShowAlert(false)}
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
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
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
  planDuration: {
    fontSize: 18,
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
  logoutButton: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#e76755',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RegistroScreen;
