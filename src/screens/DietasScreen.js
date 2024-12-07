import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DietasScreen = ({ navigation }) => {
  const [dieta, setDieta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userrol');
    await AsyncStorage.removeItem('userUser');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Configurar el botón de cierre de sesión en el header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchDieta = async () => {
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
          throw new Error('Usuario no encontrado en el almacenamiento.');
        }

        const response = await axios.get(`https://apirestgym-production-1823.up.railway.app/dieta/${AsyncUser}`, header);
        
        if (response.data) {
          setDieta(response.data);
        } else {
          throw new Error('Datos de dieta no encontrados.');
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDieta();
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar la dieta: {error.message}</Text>
      </View>
    );
  }

  if (!dieta) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se ha encontrado la dieta.</Text>
      </View>
    );
  }

  const handlePress = (semana, comidas) => {
    if (comidas) {
      navigation.navigate('DetalleDieta', { semana, comidas });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.planHeader}>
        <Image source={require('../../assets/img/Dietas.jpg')} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.planTitle}>Dietas</Text>
          <Text style={styles.planObjective}>{dieta.objetivo}</Text>
        </View>
      </View>
      <View style={styles.planBody}>
        {dieta.semanas.map((semana, index) => (
          <View key={index} style={styles.weekContainer}>
            <TouchableOpacity style={styles.touchableWeek} onPress={() => handlePress(semana.numeroSemana, semana.comidas)}>
              <Text style={styles.weekText}>Semana {semana.numeroSemana}</Text>
              <Text style={styles.weekDesc}>{semana.dias}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planHeader: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 170,
    borderRadius: 15,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  planObjective: {
    fontSize: 18,
    color: '#fff',
  },
  planBody: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  weekContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  touchableWeek: {
    flex: 1,
  },
  weekText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekDesc: {
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
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

export default DietasScreen;
