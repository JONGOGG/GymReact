import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RutinasScreen from './RutinasScreen';
import DietasScreen from './DietasScreen';
import EjerciciosScreen from './EjerciciosScreen';
import PerfilScreen from './PerfilScreen';
import { Ionicons } from '@expo/vector-icons';

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
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
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
      <Tab.Screen name="Dietas" component={DietasScreen} />
      <Tab.Screen name="Ejercicios" component={EjerciciosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
};

export default ClientScreen;
