import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import AdminScreen from '../screens/AdminScreen';
import AnimationScreen from '../screens/AnimationScreen';
import ClientScreen from '../screens/ClientScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Animation');

  useEffect(() => {
    const checkUserRole = async () => {
      const Asyntoken = await AsyncStorage.getItem('userToken');
      const Asyncrol = await AsyncStorage.getItem('userrol');

      if (Asyntoken) {
        if (Asyncrol === 'admin') {
          setInitialRoute('Admin');
        } else {
          setInitialRoute('Client');
        }
      } else {
        setInitialRoute('Login');
      }
    };

    checkUserRole();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="Animation" 
          component={AnimationScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Client" 
          component={ClientScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
