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
    'Flexiones con peso': 'https://ji323.b-cdn.net/img/Flexiones%20con%20peso.jpg',
    'Jalones al pecho': 'https://ji323.b-cdn.net/img/Jalonesalpecho.png',
     'Remo con barra': 'https://ji323.b-cdn.net/img/1221.jpg',
     'Press inclinado con mancuernas': 'https://ji323.b-cdn.net/img/Pressinclinadoconmancuernas.jpg',
     'Prensa de piernas':'https://ji323.b-cdn.net/img/Prensa%20de%20piernas.jpg',
     'Extensiones de tríceps en polea alta con cuerda':'https://ji323.b-cdn.net/img/Extensionesdetr%C3%ADcepsenpoleaaltaconcuerda.jpg',
     'Fondos en paralelas':'https://ji323.b-cdn.net/img/Fondosenparalelas.jpg',
     'Dominadas con peso':'https://ji323.b-cdn.net/img/Dominadas%20con%20peso.jpg',
     'Jalones al pecho con agarre estrecho':'https://ji323.b-cdn.net/img/Jalones%20al%20pecho%20con%20agarre%20estrecho.jpg',
     'Curl de bíceps con barra Z':'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20con%20barra%20Z.jpg',
     'Curl de bíceps alterno con mancuernas en banco inclinado':'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20alterno%20con%20mancuernas%20en%20banco%20inclinado.jpg',
     'Sentadillas con barra':'https://ji323.b-cdn.net/img/Sentadillas%20con%20barra.jpg',
     'Peso muerto con barra':'https://ji323.b-cdn.net/img/Peso%20muerto%20con%20barra.jpg',
     'Elevaciones de talones con barra':'https://ji323.b-cdn.net/img/Elevaciones%20de%20talones%20con%20barra.jpg',
     'Zancadas con mancuernas':'https://ji323.b-cdn.net/img/Zancadas%20con%20mancuernas.jpg',
     'Press militar con barra':'https://ji323.b-cdn.net/img/Zancadas%20con%20mancuernas.jpg',
     'Elevaciones laterales con mancuernas':'https://ji323.b-cdn.net/img/Elevaciones%20laterales%20con%20mancuernas.jpg',
     'Remo con barra en T con peso':'https://ji323.b-cdn.net/img/Remo%20con%20barra%20en%20T%20con%20peso.jpg',
     'Plancha lateral con elevación de pierna':'https://ji323.b-cdn.net/img/Plancha%20lateral%20con%20elevaci%C3%B3n%20de%20pierna.jpg',
     'Crunch en máquina':'https://ji323.b-cdn.net/img/Crunch%20en%20m%C3%A1quina.jpg',
     'Press de banca en máquina Smith':'https://ji323.b-cdn.net/img/Press%20de%20banca%20en%20m%C3%A1quina%20Smith.jpg',
     'Press de pecho en máquina':'https://ji323.b-cdn.net/img/Press%20de%20pecho%20en%20m%C3%A1quina.jpg',
     'Fondos en máquina asistida':'https://ji323.b-cdn.net/img/Fondos%20en%20m%C3%A1quina%20asistida.jpg',
     'Prensa de piernas en máquina':'https://ji323.b-cdn.net/img/Prensa%20de%20piernas%20en%20m%C3%A1quina.jpg',
     'Press militar en maquina Smith':'https://ji323.b-cdn.net/img/Press%20de%20banca%20en%20m%C3%A1quina%20Smith.jpg',
     'Step-ups en máquina':'https://ji323.b-cdn.net/img/Step-ups%20en%20m%C3%A1quina.jpg',
     'Peso muerto en máquina Smith':'https://ji323.b-cdn.net/img/Peso%20muerto%20con%20barra.jpg',
     'Elevaciones de talones en máquina':'https://ji323.b-cdn.net/img/Elevaciones%20de%20talones%20en%20m%C3%A1quina.jpg',
     'Curl de bíceps en máquina con polea baja':'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20en%20m%C3%A1quina%20con%20polea%C2%A0baja.jpg',
     'Sentadillas en máquina Smith':'https://ji323.b-cdn.net/img/Sentadillas%20en%20m%C3%A1quina%20Smith.jpg',
     'Curl de bíceps en máquina predicador':'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20en%20m%C3%A1quina%20predicador.jpg',
     'Flexiones en máquina':'https://ji323.b-cdn.net/img/Flexiones%20en%20m%C3%A1quina.jpg',
     'Remo en máquina con agarre neutro':'https://ji323.b-cdn.net/img/Remo%20en%20m%C3%A1quina%20con%20agarre%20neutro.jpg',
     'Extensiones de tríceps en máquina':'https://ji323.b-cdn.net/img/Extensiones%20de%20tr%C3%ADceps%20en%20m%C3%A1quina.jpg',
     'Remo en máquina Hammer Strength':'https://ji323.b-cdn.net/img/Remo%20en%20m%C3%A1quina%20Hammer%20Strength.jpg',
     'Estiramientos avanzados':'https://ji323.b-cdn.net/img/Estiramientos%20avanzados.jpg',
     'Jalones en polea con agarre ancho':'https://ji323.b-cdn.net/img/Jalones%20en%20polea%20con%20agarre%C2%A0ancho.jpg',
    };

    const imagRandom = [
      'https://ji323.b-cdn.net/img/Flexiones%20con%20peso.jpg',
      'https://ji323.b-cdn.net/img/Jalonesalpecho.png',
      'https://ji323.b-cdn.net/img/1221.jpg',
      'https://ji323.b-cdn.net/img/Pressinclinadoconmancuernas.jpg',
      'https://ji323.b-cdn.net/img/Prensa%20de%20piernas.jpg',
      'https://ji323.b-cdn.net/img/Jalones%20al%20pecho%20con%20agarre%20estrecho.jpg',
      'https://ji323.b-cdn.net/img/Extensionesdetr%C3%ADcepsenpoleaaltaconcuerda.jpg',
      'https://ji323.b-cdn.net/img/Fondosenparalelas.jpg',
      'https://ji323.b-cdn.net/img/Dominadas%20con%20peso.jpg',
      'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20con%20barra%20Z.jpg',
      'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20alterno%20con%20mancuernas%20en%20banco%20inclinado.jpg',
      'https://ji323.b-cdn.net/img/Sentadillas%20con%20barra.jpg',
      'https://ji323.b-cdn.net/img/Peso%20muerto%20con%20barra.jpg',
      'https://ji323.b-cdn.net/img/Elevaciones%20de%20talones%20con%20barra.jpg',
      'https://ji323.b-cdn.net/img/Zancadas%20con%20mancuernas.jpg',
      'https://ji323.b-cdn.net/img/Elevaciones%20laterales%20con%20mancuernas.jpg',
      'https://ji323.b-cdn.net/img/Remo%20con%20barra%20en%20T%20con%20peso.jpg',
      'https://ji323.b-cdn.net/img/Plancha%20lateral%20con%20elevaci%C3%B3n%20de%20pierna.jpg',
      'https://ji323.b-cdn.net/img/Crunch%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Press%20de%20banca%20en%20m%C3%A1quina%20Smith.jpg',
      'https://ji323.b-cdn.net/img/Press%20de%20pecho%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Fondos%20en%20m%C3%A1quina%20asistida.jpg',
      'https://ji323.b-cdn.net/img/Prensa%20de%20piernas%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Press%20de%20banca%20en%20m%C3%A1quina%20Smith.jpg',
      'https://ji323.b-cdn.net/img/Step-ups%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Peso%20muerto%20con%20barra.jpg',
      'https://ji323.b-cdn.net/img/Elevaciones%20de%20talones%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20en%20m%C3%A1quina%20con%20polea%C2%A0baja.jpg',
      'https://ji323.b-cdn.net/img/Sentadillas%20en%20m%C3%A1quina%20Smith.jpg',
      'https://ji323.b-cdn.net/img/Curl%20de%20b%C3%ADceps%20en%20m%C3%A1quina%20predicador.jpg',
      'https://ji323.b-cdn.net/img/Flexiones%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Remo%20en%20m%C3%A1quina%20con%20agarre%20neutro.jpg',
      'https://ji323.b-cdn.net/img/Extensiones%20de%20tr%C3%ADceps%20en%20m%C3%A1quina.jpg',
      'https://ji323.b-cdn.net/img/Remo%20en%20m%C3%A1quina%20Hammer%20Strength.jpg',
      'https://ji323.b-cdn.net/img/Estiramientos%20avanzados.jpg',
      'https://ji323.b-cdn.net/img/Jalones%20en%20polea%20con%20agarre%C2%A0ancho.jpg'
      
    ];
  

    return imagenesEjercicios[nombreEjercicio] || imagRandom[Math.floor(Math.random() * imagRandom.length)];
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
    height: 350,
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
