
import React, { useState, useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from '@expo/vector-icons';
import RutinasScreen from './RutinasScreen';
import DietasScreen from './DietasScreen';
import PerfilScreen from './PerfilScreen';
import DetalleEjercicio from './DetallesEjerScreen';
import DetalleDieta from './DetalleDieta';

const Tab = createBottomTabNavigator();

const ClientScreen = () => {
  const [showExitAlert, setShowExitAlert] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setShowExitAlert(true);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleExitApp = () => {
    setShowExitAlert(false);
    BackHandler.exitApp();
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Rutinas') {
              iconName = 'fitness-outline';
            } else if (route.name === 'Dietas') {
              iconName = 'nutrition-outline';
            } else if (route.name === 'Ejercicios') {
              iconName = 'body-outline';
            } else if (route.name === 'Perfil') {
              iconName = 'person-outline';
            } else if (route.name === 'DetalleDieta') {
              iconName = 'restaurant-outline';
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
        <Tab.Screen name="DetalleDieta" component={DetalleDieta} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
      <AwesomeAlert
        show={showExitAlert}
        showProgress={false}
        title="Salir de la aplicación"
        message="¿Estás seguro de que quieres salir?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No"
        confirmText="Sí"
        confirmButtonColor='#e76755'
        cancelButtonColor='#70b1f7'
        onCancelPressed={() => {
          setShowExitAlert(false);
        }}
        onConfirmPressed={handleExitApp}
      />
    </>
  );
};

export default ClientScreen;
