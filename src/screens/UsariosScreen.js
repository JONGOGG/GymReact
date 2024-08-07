import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import axios from 'axios';

const UsuariosScreen = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    sexo: '',
    peso: '',
    estatura: '',
    estado_suscripcion: '',
    user: '',
    pass: ''
  });

  useEffect(() => {
    listarUsuarios();
  }, []);

  const listarUsuarios = async () => {
    try {
      const response = await axios.get('https://apirestgym-production-23c8.up.railway.app/listar_Usuarios');
      setUsuarios(response.data.usuarios);
    } catch (error) {
      console.error('Error al listar usuarios', error);
    }
  };

  const actualizarUsuario = async (user) => {
    try {
      const response = await axios.put(`https://apirestgym-production-23c8.up.railway.app/actualizar/${user}`, formData);
      setEditUser(null);
      listarUsuarios();
      Alert.alert(response.data.message);
    } catch (error) {
      console.error('Error al actualizar usuario', error);
    }
  };

  const eliminarUsuario = async (user) => {
    try {
      const response = await axios.delete(`https://apirestgym-production-23c8.up.railway.app/eliminar_Usuarios/${user}`);
      listarUsuarios();
      Alert.alert(response.data.message);
    } catch (error) {
      console.error('Error al eliminar usuario', error);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = (usuario) => {
    setEditUser(usuario.user);
    setFormData(usuario);
  };

  const renderItem = ({ item }) => (
    <View key={item.user} style={{ marginBottom: 20 }}>
      <Text>{item.nombre} {item.apellidos} - {item.email}</Text>
      <Button title="Editar" onPress={() => handleEdit(item)} />
      <Button title="Eliminar" onPress={() => eliminarUsuario(item.user)} />
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Lista de Usuarios</Text>
      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.user}
      />
      {editUser && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Editar Usuario</Text>
          <TextInput
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(text) => handleChange('nombre', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Apellidos"
            value={formData.apellidos}
            onChangeText={(text) => handleChange('apellidos', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Teléfono"
            value={formData.telefono}
            onChangeText={(text) => handleChange('telefono', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Sexo"
            value={formData.sexo}
            onChangeText={(text) => handleChange('sexo', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Peso"
            value={formData.peso}
            onChangeText={(text) => handleChange('peso', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Estatura"
            value={formData.estatura}
            onChangeText={(text) => handleChange('estatura', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Estado Suscripción"
            value={formData.estado_suscripcion}
            onChangeText={(text) => handleChange('estado_suscripcion', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="User"
            value={formData.user}
            onChangeText={(text) => handleChange('user', text)}
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            placeholder="Contraseña"
            value={formData.pass}
            onChangeText={(text) => handleChange('pass', text)}
            secureTextEntry
            style={{ borderBottomWidth: 1, marginBottom: 10 }}
          />
          <Button title="Guardar" onPress={() => actualizarUsuario(editUser)} />
        </View>
      )}
    </View>
  );
};

export default UsuariosScreen;
