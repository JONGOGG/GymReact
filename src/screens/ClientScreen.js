import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClientScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Bienbenido, este es el apartado del cliente</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default ClientScreen;
