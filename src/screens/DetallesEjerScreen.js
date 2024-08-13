import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DetalleEjercicioScreen = ({ route }) => {
  const { dia, ejercicios } = route.params || {};
  const viewShotRef = useRef();
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

  const compartirRutina = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Compartir Rutina de Ejercicio',
          mimeType: 'image/png',
        });
      } else {
        alert('El compartir archivos no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error("Error al compartir la rutina: ", error);
    }
  };

  if (!dia || !ejercicios) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
        Selecciona un ejercicio en el apartado de RUTINAS
        </Text>
      </View>
    );
  }

  const ejerciciosValidos = Object.keys(ejercicios).filter((key) => {
    const ejercicio = ejercicios[key];
    return ejercicio.nombre && ejercicio.series && ejercicio.repeticiones;
  });

  if (ejerciciosValidos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay ejercicios disponibles para mostrar.</Text>
      </View>
    );
  }

  const obtenerImagenEjercicio = (nombreEjercicio) => {
    const imagenesEjercicios = {
      'Sentadillas': 'https://drive.google.com/uc?export=view&id=1A2B3C4D5E6F7G8H',
      'Flexiones': 'https://drive.google.com/uc?export=view&id=2B3C4D5E6F7G8H1A',
      'Jalones al pecho': 'https://ji323.b-cdn.net/img/Jalonesalpecho.png',
      // Añade más ejercicios y sus imágenes de Google Drive aquí
    };

    return imagenesEjercicios[nombreEjercicio] || 'https://via.placeholder.com/150';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.captureContainer}>
          <Text style={styles.headerText}>{dia.replace(/^dia\d+_/, '').replace(/_/g, ' ').toUpperCase()}</Text>
          {ejerciciosValidos.map((key, idx) => (
            <View key={idx} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <Icon name="barbell" size={30} color="#4A90E2" style={styles.exerciseIcon} />
                <Text style={styles.exerciseName}>{ejercicios[key].nombre}</Text>
              </View>

              <Image
                source={{ uri: obtenerImagenEjercicio(ejercicios[key].nombre) }}
                style={styles.exerciseImage}
              />

              <Text style={styles.exerciseDetails}>Series: {ejercicios[key].series}</Text>
              <Text style={styles.exerciseDetails}>Repeticiones: {ejercicios[key].repeticiones}</Text>
              {ejercicios[key].instrucciones ? (
                <>
                  <View style={styles.separator} />
                  <Text style={styles.instructionsTitle}>Instrucciones:</Text>
                  <Text style={styles.instructionsText}>
                    <Text style={styles.boldText}>Posición: </Text>
                    {ejercicios[key].instrucciones.Posición}
                  </Text>
                  <Text style={styles.instructionsText}>
                    <Text style={styles.boldText}>Ejecución: </Text>
                    {ejercicios[key].instrucciones.Ejecución}
                  </Text>
                  <Text style={styles.instructionsText}>
                    <Text style={styles.boldText}>Consejo: </Text>
                    {ejercicios[key].instrucciones.Consejo}
                  </Text>
                </>
              ) : (
                <Text style={styles.instructionsText}>Instrucciones no disponibles</Text>
              )}
            </View>
          ))}

          <View style={styles.shareButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={compartirRutina}>
              <Icon name="share-social" size={24} color="#fff" />
              <Text style={styles.buttonText}>Compartir Rutina</Text>
            </TouchableOpacity>
          </View>
        </ViewShot>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  captureContainer: {
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 30,
    textAlign: 'center',
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseIcon: {
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 50,
  },
  shareButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
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

export default DetalleEjercicioScreen;
