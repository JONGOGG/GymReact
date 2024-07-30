
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RegistroScreen from './RegistroScreen';


const Tab = createBottomTabNavigator();

const AdminScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Registrar" component={RegistroScreen} />
    </Tab.Navigator>
  );
};

export default AdminScreen;