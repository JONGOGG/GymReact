import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Biblioteca de iconos
import ViewShot from 'react-native-view-shot'; // Para capturar la pantalla
import * as Sharing from 'expo-sharing'; // Para compartir la imagen
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const DetalleEjercicioScreen = ({ route }) => {
  const { dia, ejercicios } = route.params || {};
  const viewShotRef = useRef(); // Referencia para la vista que vamos a capturar

  // Función para formatear y capitalizar el nombre del día
  const formatearDia = (dia) => {
    return dia.replace(/^dia\d+_/, '').replace(/_/g, ' ').toUpperCase();
  };
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


  // Función para capturar la pantalla y compartirla
  const compartirRutina = async () => {
    try {
      // Captura la vista como una imagen
      const uri = await viewShotRef.current.capture();
      
      // Verifica si el dispositivo puede compartir archivos
      if (await Sharing.isAvailableAsync()) {
        // Comparte la imagen capturada
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

  // Si no se proporciona día ni ejercicios, muestra un mensaje de error
  if (!dia || !ejercicios) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No has seleccionado ningún ejercicio en el apartado de RUTINAS.
        </Text>
      </View>
    );
  }

  // Filtra los ejercicios válidos
  const ejerciciosValidos = Object.keys(ejercicios).filter((key) => {
    const ejercicio = ejercicios[key];
    return ejercicio.nombre && ejercicio.series && ejercicio.repeticiones;
  });

  // Si no hay ejercicios válidos, muestra un mensaje de error
  if (ejerciciosValidos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No hay ejercicios disponibles para mostrar.</Text>
      </View>
    );
  }

  // Renderiza la lista de ejercicios
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.captureContainer}>
          <Text style={styles.headerText}>{formatearDia(dia)}</Text>
          {ejerciciosValidos.map((key, idx) => (
            <View key={idx} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <Icon name="barbell" size={30} color="#4A90E2" style={styles.exerciseIcon} />
                <Text style={styles.exerciseName}>{ejercicios[key].nombre}</Text>
              </View>

              {/* Imagen del ejercicio */}
              <Image
                source={{ uri: ejercicios[key].imagen || 'https://via.placeholder.com/150' }}
                style={styles.exerciseImage}
              />

              {/* Detalles del ejercicio */}
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

          {/* Botón de Compartir */}
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
    height: 150,
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
    color: 'red',
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
