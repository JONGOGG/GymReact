import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Biblioteca de iconos
import ViewShot from 'react-native-view-shot'; // Para capturar la pantalla
import * as Sharing from 'expo-sharing'; // Para compartir la imagen
import { useNavigation } from '@react-navigation/native';

const DetalleDietaScreen = ({ route }) => {
  const { semana, comidas } = route.params || {};
  const viewShotRef = useRef(); // Referencia para la vista que vamos a capturar

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
  const compartirDieta = async () => {
    try {
      // Captura la vista como una imagen
      const uri = await viewShotRef.current.capture();
      
      // Verifica si el dispositivo puede compartir archivos
      if (await Sharing.isAvailableAsync()) {
        // Comparte la imagen capturada
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Compartir Detalle de Dieta',
          mimeType: 'image/png',
        });
      } else {
        alert('El compartir archivos no está disponible en este dispositivo.');
      }
    } catch (error) {
      console.error("Error al compartir la dieta: ", error);
    }
  };

  // Si no se proporciona semana ni comidas, muestra un mensaje de error
  if (!semana || !comidas) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se ha seleccionado ninguna dieta.</Text>
      </View>
    );
  }

  // Elimina las propiedades `_id` de los objetos de comidas
  const cleanComidas = {};
  for (const [comida, alimentos] of Object.entries(comidas)) {
    cleanComidas[comida] = {};
    for (const [key, value] of Object.entries(alimentos)) {
      if (key !== '_id') {
        cleanComidas[comida][key] = value;
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }} style={styles.captureContainer}>
          <Text style={styles.headerText}>Semana {semana}</Text>
          {Object.keys(cleanComidas).map((comida, idx) => (
            <View key={idx} style={styles.mealContainer}>
              <View style={styles.mealHeader}>
                <Icon name="restaurant" size={30} color="#4A90E2" style={styles.mealIcon} />
                <Text style={styles.mealTitle}>{comida.charAt(0).toUpperCase() + comida.slice(1)}</Text>
              </View>
              {Object.keys(cleanComidas[comida]).map((alimento, idx) => (
                <Text key={idx} style={styles.foodText}>{cleanComidas[comida][alimento]}</Text>
              ))}
            </View>
          ))}

          {/* Botón de Compartir */}
          <View style={styles.shareButtonContainer}>
            <TouchableOpacity style={styles.button} onPress={compartirDieta}>
              <Icon name="share-social" size={24} color="#fff" />
              <Text style={styles.buttonText}>Compartir Dieta</Text>
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
  mealContainer: {
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
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealIcon: {
    marginRight: 10,
  },
  mealTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  foodText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
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

export default DetalleDietaScreen;
