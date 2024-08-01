import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EjerciciosScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Ejercicios</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EjerciciosScreen;
