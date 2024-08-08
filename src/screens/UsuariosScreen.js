import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import UpdateUserScreen from './UpdateUserScreen'; // Importa tu pantalla de actualización

const Stack = createNativeStackNavigator();

const UsersList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://apirestgym-production-23c8.up.railway.app/listar_Usuarios');
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        } else {
          console.error('Formato de respuesta incorrecto', response.data);
          Alert.alert('Error', 'Formato de respuesta incorrecto');
        }
      } catch (error) {
        console.error('Error al listar usuarios:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = (user) => {
    navigation.navigate('ActualizarUsuario', { user }); // Navegar a la pantalla de actualización
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`https://apirestgym-production-23c8.up.railway.app/eliminar_Usuarios/${userId}`);
      if (response.data && response.data.mensaje === 'Usuario eliminado correctamente') {
        setUsers(users.filter((user) => user._id !== userId));
        Alert.alert('Éxito', 'Usuario eliminado correctamente');
      } else {
        console.error('Error al eliminar usuario', response.data);
        Alert.alert('Error', 'No se pudo eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Alert.alert('Error', 'No se pudo eliminar el usuario');
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
        placeholder="Buscar usuario por nombrer"
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
              <TouchableOpacity onPress={() => handleDeleteUser(user._id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
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
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UsuariosScreen;
