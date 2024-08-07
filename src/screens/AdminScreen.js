import React, { useState, useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RegistroScreen from './RegistroScreen';
import UsariosScreen from './UsariosScreen';
import LogsScreen from './LogsScreen';
import AwesomeAlert from 'react-native-awesome-alerts';

const Tab = createBottomTabNavigator();

const iconMap = {
  Registrar: 'user-plus',
  Usuarios: 'users',
  Logs: 'file-text',
};

const AdminScreen = () => {
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

  return (<>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = iconMap[route.name];
          return <Icon name={iconName} size={size || 20} color={color || 'black'} />;
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
      <Tab.Screen name="Registrar" component={RegistroScreen} />
      <Tab.Screen name="Usuarios" component={UsariosScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
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
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowExitAlert(false);
        }}
        onConfirmPressed={handleExitApp}
      />
    </>
  );
};

export default AdminScreen;
