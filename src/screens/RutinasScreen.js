import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const RutinasScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>ALda gym</Text>
      <Text style={styles.subHeaderText}>30 días</Text>
      <View style={styles.planContainer}>
        <TouchableOpacity style={styles.dayContainer}>
          <Text style={styles.dayText}>Día 1</Text>
          <Text style={styles.dayDesc}>Pecho</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Comienzo</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={styles.lockedDayContainer}>
          <Text style={styles.dayText}>Día 2</Text>
          <Text style={styles.dayDesc}>Espalda</Text>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
        <View style={styles.lockedDayContainer}>
          <Text style={styles.dayText}>Día 3</Text>
          <Text style={styles.dayDesc}>Tren inferior</Text>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
        <View style={styles.restDayContainer}>
          <Text style={styles.dayText}>Día de descanso</Text>
        </View>
        <View style={styles.lockedDayContainer}>
          <Text style={styles.dayText}>Día 5</Text>
          <Text style={styles.dayDesc}>Hombros</Text>
          <Text style={styles.lockedText}>🔒</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const EjerciciosScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Ejercicios</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Plan" component={RutinasScreen} />
        <Tab.Screen name="Ejercicios" component={EjerciciosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subHeaderText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
  },
  planContainer: {
    margin: 20,
  },
  dayContainer: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  lockedDayContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  restDayContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayDesc: {
    fontSize: 14,
    color: 'gray',
  },
  startButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 24,
    color: 'gray',
  },
});

export default RutinasScreen;
