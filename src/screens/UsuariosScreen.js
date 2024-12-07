import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import UpdateUserScreen from './UpdateUserScreen';

const Stack = createNativeStackNavigator();

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const fetchUsers = async () => {
    console.log('Fetching users...');
    setLoading(true);
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
      console.log('AsyncUser:', AsyncUser);
      const response = await axios.get(`https://apirestgym-production-1823.up.railway.app/listar_Usuarios/${AsyncUser}`, header);
      console.log('Response:', response.data);
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        console.error('Formato de respuesta incorrecto', response.data);
        setAlertMessage('Formato de respuesta incorrecto');
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      setAlertMessage('No se pudo obtener la lista de usuarios');
      setAlertType('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen is focused');
      fetchUsers();
    }, [])
  );

  const handleUpdateUser = (user) => {
    navigation.navigate('ActualizarUsuario', { user });
  };

  const handleDeleteUser = async (user) => {
    try {
      const userName = user.user;
      if (!userName) {
        setAlertMessage('Nombre de usuario no disponible');
        setAlertType('error');
        setShowAlert(true);
        return;
      }
      const AsyncUserr = await AsyncStorage.getItem('userUser');
      const tokens = await AsyncStorage.getItem('userToken');
      // Configuración de los headers
      const header = {
        headers: {
          'x-access-token': `${tokens}`,  
          'Content-Type': 'application/json',  
    
        }
      };
      const url = `https://apirestgym-production-1823.up.railway.app/eliminar_Usuarios/${userName}/${AsyncUserr}`;
      const response = await axios.delete(url, header);
      if (response.data && response.data.mensaje === 'Usuario eliminado correctamente') {
        setUsers(users.filter((u) => u.user !== user.user));
        setAlertMessage('Usuario eliminado correctamente');
        setAlertType('success');
        setShowAlert(true);
      } else {
        console.error('Error al eliminar usuario', response.data);
        setAlertMessage('No se pudo eliminar el usuario');
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setAlertMessage('No se pudo eliminar el usuario');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const handleUpdateSubscription = async (user) => {
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
      if (!AsyncUser) {
        throw new Error('No se encontró el usuario en AsyncStorage');
      }
      const url = `https://apirestgym-production-1823.up.railway.app/actualizar_sus/${user.user}/${AsyncUser}`;
      const response = await axios.put(url, { estado_suscripcion: 'activo' }, header);

      const successMessages = [
        'Suscripción actualizada correctamente', 
        'Suscripcion actualizada correctamente'
      ];

      if (response.data && successMessages.includes(response.data.message)) {
        setUsers(users.map((u) => 
          u.user === user.user ? { ...u, estado_suscripcion: 'activo' } : u
        ));
        setAlertMessage('Suscripción actualizada correctamente');
        setAlertType('success');
        setShowAlert(true);
      } else {
        console.error('Error al actualizar suscripción:', response.data);
        setAlertMessage('No se pudo actualizar la suscripción');
        setAlertType('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error al actualizar suscripción:', error);
      setAlertMessage('No se pudo actualizar la suscripción');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    user.user.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Información Personal</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar usuario por nombre"
        value={searchText}
        onChangeText={setSearchText}
      />
      <ScrollView>
        {filteredUsers.map((user) => (
          <View key={user._id} style={styles.userCard}>
            <Image
              source={{ uri: `https://api.dicebear.com/5.x/initials/png?seed=${user.nombre}` }}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{user.nombre} {user.apellidos}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Teléfono: {user.telefono}</Text>
            <Text>Sexo: {user.sexo}</Text>
            <Text>Peso: {user.peso}</Text>
            <Text>Estatura: {user.estatura}</Text>
            <Text>Estado de Suscripción: {user.estado_suscripcion}</Text>
            <Text>Días de Suscripción: {user.dias_suscripcion}</Text>
            <Text>Tipo de Rutina: {user.tipo_rutina}</Text>
            <Text>Usuario: {user.user}</Text>
            <Text>Tipo de Usuario: {user.tipo_usuario}</Text>
            <Text>Fecha de Registro: {new Date(user.fecha_registro).toLocaleDateString()}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleUpdateUser(user)} style={styles.button}>
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
              {user.estado_suscripcion === 'Inactivo' && (
                <TouchableOpacity onPress={() => handleUpdateSubscription(user)} style={styles.updateSubscriptionButton}>
                  <Text style={styles.buttonText}>Suscripción</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleDeleteUser(user)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
    </View>
  );
};

const UsuariosScreen = () => {
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

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListaUsuarios"
        component={UsersList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ActualizarUsuario"
        component={UpdateUserScreen}
        options={{ title: 'Actualizar Usuario' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 2,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#70b1f7',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#e76755',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  updateSubscriptionButton: {
    backgroundColor: '#84dd55',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
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

export default UsuariosScreen;
