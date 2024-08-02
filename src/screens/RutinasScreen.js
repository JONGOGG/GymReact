import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import rutinas from '../../assets/img/rutinas.png';

const RutinasScreen = ({ navigation }) => {
  // Estados para manejar la rutina, el estado de carga y los errores
  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para cargar la rutina cuando el componente se monta
  useEffect(() => {
    axios.get('https://apirestgym-production-23c8.up.railway.app/rutina/joan')
      .then(response => {
        setRutina(response.data.rutina);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
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
  },
  touchableDay: {
    flex: 1,
  },
  currentDayContainer: {
    backgroundColor: '#3b5998', // Color diferente para el día actual
    color: '#fff',
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
});

export default RutinasScreen;
