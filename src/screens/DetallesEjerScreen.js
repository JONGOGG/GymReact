import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DetalleEjercicioScreen = ({ route }) => {
  const { dia, ejercicios } = route.params || {};

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
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>{dia}</Text>
      {ejerciciosValidos.map((key, idx) => (
        <View key={idx} style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{ejercicios[key].nombre}</Text>
          <Text>Series: {ejercicios[key].series}</Text>
          <Text>Repeticiones: {ejercicios[key].repeticiones}</Text>
          {ejercicios[key].instrucciones ? (
            <>
              <Text>Posición: {ejercicios[key].instrucciones.Posición}</Text>
              <Text>Ejecución: {ejercicios[key].instrucciones.Ejecución}</Text>
              <Text>Consejo: {ejercicios[key].instrucciones.Consejo}</Text>
            </>
          ) : (
            <Text>Instrucciones no disponibles</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  restText: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
  },
});

export default DetalleEjercicioScreen;
