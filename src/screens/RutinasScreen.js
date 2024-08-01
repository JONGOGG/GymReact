import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const RutinasScreen = ({ navigation }) => {
  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar la rutina: {error.message}</Text>
      </View>
    );
  }

  const handlePress = (dia, ejercicios) => {
    if (ejercicios) {
      navigation.navigate('Ejercicios', { dia, ejercicios });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Desarrollo Muscular</Text>
      <Text style={styles.subHeaderText}>30 días</Text>
      {Object.keys(rutina).map((dia, index) => (
        <TouchableOpacity
          key={index}
          style={styles.planContainer}
          onPress={() => handlePress(dia, rutina[dia])}
        >
          <Text style={styles.dayText}>Día {index + 1}</Text>
        </TouchableOpacity>
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
  subHeaderText: {
    fontSize: 18,
    marginBottom: 20,
  },
  planContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  dayText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default RutinasScreen;
