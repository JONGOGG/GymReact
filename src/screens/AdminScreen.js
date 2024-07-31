
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegistroScreen from './RegistroScreen';
import UsariosScreen from './UsariosScreen';
import LogsScreen from './LogsScreen'

const Tab = createBottomTabNavigator();

const AdminScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Registrar" component={RegistroScreen} />
      <Tab.Screen name="Usuarios" component={UsariosScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
    </Tab.Navigator>
  );
};

export default AdminScreen;