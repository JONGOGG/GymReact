import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RutinasScreen from './RutinasScreen';
import DietasScreen from './DietasScreen';
import EjerciciosScreen from './EjerciciosScreen';

const Tab = createBottomTabNavigator();

const ClientScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Dietas" component={DietasScreen} />
      <Tab.Screen name="Ejercicios" component={EjerciciosScreen} />
    </Tab.Navigator>
  );
};

export default ClientScreen;