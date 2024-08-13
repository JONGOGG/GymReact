import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import rutinas from '../../assets/img/rutinas.png';

const RutinasScreen = ({ navigation }) => {
  // Estados para manejar la rutina, el estado de carga y los errores
  const [rutina, setRutina] = useState(null);
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


  // useEffect para cargar la rutina cuando el componente se monta
  useEffect(() => {
    // Función para cargar el usuario y obtener la rutina
   const fetchRutina = async () => {
  try {
    const AsyncUser = await AsyncStorage.getItem('userUser');
    const token = await AsyncStorage.getItem('userToken');

    if (!AsyncUser || !token) {
      throw new Error('Usuario o token no encontrado.');
    }

    console.log('Token:', token);  // Verifica el valor del token

    const header = {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
      }
    };

    console.log('Header:', header);  // Verifica la configuración del encabezado

    const response = await axios.get(`https://apirestgym-production-23c8.up.railway.app/rutina/${AsyncUser}`, header);
    console.log('Respuesta:', response.data);  // Verifica la respuesta
    setRutina(response.data.rutina);
  } catch (err) {
    console.error('Error al realizar la solicitud:', err.message);
    setError(err);
  } finally {
    setLoading(false);
  }
};

    fetchRutina();
  }, []);

  // Mostrar un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Mostrar un mensaje de error si ocurre un problema al cargar los datos
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar la rutina: {error.message}</Text>
      </View>
    );
  }

  // Función para manejar la navegación al hacer clic en un día
  const handlePress = (dia, ejercicios) => {
    if (ejercicios) {
      navigation.navigate('Ejercicios', { dia, ejercicios });
    }
  };

  // Array con los nombres de los días de la semana
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Obtener el índice del día actual (0 para Domingo, 1 para Lunes, ..., 6 para Sábado)
  const currentDayIndex = new Date().getDay(); // Esto devuelve 0-6 para Dom-Sáb

  // Ajustar el índice para el formato en español (1 para Lunes, 2 para Martes, ..., 7 para Domingo)
  const adjustedDayIndex = (currentDayIndex + 6) % 7;

  // Agregar Sábado y Domingo manualmente si no están en la rutina
  const diasConRutina = [
    ...Object.keys(rutina),
    ...(Object.keys(rutina).length < 7 ? ["sábado", "domingo"] : []),
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.planHeader}>
        <Image source={rutinas} style={styles.headerImage} />
        <View style={styles.headerOverlay}>
          <Text style={styles.planTitle}>DESARROLLA TU MEJOR VERSION</Text>
          <Text style={styles.planDuration}>30 días</Text>
        </View>
      </View>
      <View style={styles.planBody}>
        {diasConRutina.map((dia, index) => (
          <View key={index} style={[
            styles.dayContainer,
            index === adjustedDayIndex ? styles.currentDayContainer : null // Aplicar estilo si es el día actual
          ]}>
            <TouchableOpacity
              style={styles.touchableDay}
              onPress={() => handlePress(dia, rutina[dia])}
            >
              <Text style={[
                styles.dayText,
                index === adjustedDayIndex ? styles.currentDayText : null // Aplicar color de texto si es el día actual
              ]}>{diasSemana[index] || `Día ${index + 1}`}</Text>
              {dia.toLowerCase() === 'sábado' || dia.toLowerCase() === 'domingo' ? (
                <Text style={styles.restText}>Descanso</Text>
              ) : (
                <Text style={[
                  styles.dayDesc,
                  index === adjustedDayIndex ? styles.currentDayDesc : null // Aplicar color de texto si es el día actual
                ]}>{rutina[dia] ? 'Ejercicios Disponibles' : ''}</Text>
              )}
            </TouchableOpacity>
            {index === adjustedDayIndex && rutina[dia] && (
              <TouchableOpacity
                style={[
                  styles.startButton,
                  index === adjustedDayIndex ? styles.currentStartButton : null // Aplicar estilo si es el día actual
                ]}
                onPress={() => handlePress(dia, rutina[dia])}
              >
                <Text style={[
                  styles.startButtonText,
                  index === adjustedDayIndex ? styles.currentStartButtonText : null // Aplicar estilo de texto si es el día actual
                ]}>Comienzo</Text>
              </TouchableOpacity>
            )}
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
  planDuration: {
    fontSize: 18,
    color: '#fff',
  },
  planBody: {
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  dayContainer: {
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
  touchableDay: {
    flex: 1,
  },
  currentDayContainer: {
    backgroundColor: '#3b5998', // Color diferente para el día actual
    color: '#fff',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentDayText: {
    color: '#fff', // Color del texto para el día actual
  },
  currentDayDesc: {
    color: '#fff', // Color del texto de la descripción para el día actual
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  currentStartButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3b5998',
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dayDesc: {
    fontSize: 16,
    color: '#555',
  },
  restText: {
    fontSize: 16,
    color: '#888',
  },
  startButtonText: {
    fontSize: 16,
    color: '#3b5998',
    fontWeight: 'bold',
  },
  currentStartButtonText: {
    color: '#3b5998',
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

export default RutinasScreen;
