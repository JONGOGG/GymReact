import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DetalleEjercicioScreen = ({ route }) => {
  const { dia, ejercicios } = route.params || {};

  if (!dia || !ejercicios) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No has seleccionado ningun ejercicio en el apartado de RUTINAS.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>{dia}</Text>
      {Object.keys(ejercicios).map((ejercicio, idx) => (
        <View key={idx} style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{ejercicios[ejercicio].nombre}</Text>
          <Text>Series: {ejercicios[ejercicio].series}</Text>
          <Text>Repeticiones: {ejercicios[ejercicio].repeticiones}</Text>
          {ejercicios[ejercicio].instrucciones ? (
            <>
              <Text>Posición: {ejercicios[ejercicio].instrucciones.Posición}</Text>
              <Text>Ejecución: {ejercicios[ejercicio].instrucciones.Ejecución}</Text>
              <Text>Consejo: {ejercicios[ejercicio].instrucciones.Consejo}</Text>
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
});

export default DetalleEjercicioScreen;
