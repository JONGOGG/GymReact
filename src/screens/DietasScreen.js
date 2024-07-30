import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DietasScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Dietas</Text>
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

export default DietasScreen;
