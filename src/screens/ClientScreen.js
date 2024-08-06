import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RutinasScreen from './RutinasScreen';
import DietasScreen from './DietasScreen';
import EjemplosScreen from './EjemplosScreen';
import PerfilScreen from './PerfilScreen';
import { Ionicons } from '@expo/vector-icons';
import DetalleEjercicio from './DetallesEjerScreen';

const Tab = createBottomTabNavigator();

const ClientScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Rutinas') {
            iconName = 'fitness-outline';
          } else if (route.name === 'Dietas') {
            iconName = 'nutrition-outline';
          } else if (route.name === 'Ejercicios') {
            iconName = 'barbell-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          } else if (route.name === 'Ejemplos') {
            iconName = 'body-outline';
          }
          
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Ejercicios" component={DetalleEjercicio} />
      <Tab.Screen name="Dietas" component={DietasScreen} />
      <Tab.Screen name="Ejemplos" component={EjemplosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
};

export default ClientScreen;
