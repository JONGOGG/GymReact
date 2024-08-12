import React, { useRef, useEffect, useState } from 'react';
import {SafeAreaView, Text, View, StyleSheet, Dimensions, Animated, StatusBar, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation(); 
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const [timeoutPassed, setTimeoutPassed] = useState(false);

  useEffect(() => {
    if (timeoutPassed) {
      // Si ya pasó el timeout, navega directamente al Login
      navigation.replace('Login');  // Usamos replace en lugar de navigate
      return;
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(translateAnim, {
        duration: 2000,
        toValue: Dimensions.get('window').width / 1.4,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        duration: 1000,
        toValue: 0,
        delay: 0,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(textFadeAnim, {
      duration: 2000,
      toValue: 1,
      delay: 2500,
      useNativeDriver: true,
    }).start();

    // Navega al Login después de 3 segundos y establece que el timeout ha pasado
    const timeout = setTimeout(() => {
      setTimeoutPassed(true);
      navigation.replace('Login');  // Usamos replace en lugar de navigate
    }, 4000);

    // Limpia el timeout al desmontar el componente
    return () => clearTimeout(timeout);
  }, [navigation, scaleAnim, fadeAnim, translateAnim, textFadeAnim, timeoutPassed]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.contentContainer}>
        <Animated.Image
          style={[
            styles.imageLarge,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          source={require('../../assets/img/file.png')}
        />
        <Animated.View style={[styles.logoContainer, { transform: [{ translateX: translateAnim }] }]}>
          <Text style={styles.logoText}>GYM </Text>
          <Animated.Text style={[styles.logoText, { opacity: textFadeAnim }]}>
            BROS
          </Animated.Text>
        </Animated.View>
        <Image
          source={require('../../assets/azteticss.png')}
          style={styles.image}
        />
        <Text style={styles.creditText}>By Aztetics</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  imageLarge: {
    width: 300,
    height: 350,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 40,
    color: 'white',
    fontWeight: '900',
  },
  logoContainer: {
    flexDirection: 'row',
    marginTop: 110,
  },
  creditText: {
    marginTop: 10,
    fontSize: 12,
    color: 'white',
  },
});
