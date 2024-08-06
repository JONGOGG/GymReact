import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegistroScreen from './RegistroScreen';
import UsariosScreen from './UsariosScreen';
import LogsScreen from './LogsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const iconMap = {
  Registrar: 'user-plus',
  Usuarios: 'users',
  Logs: 'file-text',
};

const AdminScreen = () => {
  return (
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
  );
};

export default AdminScreen;
