import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegistroScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Rutinas</Text>
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

export default RegistroScreen;
