import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UsariosScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Usuarios</Text>
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

export default UsariosScreen;
