import React, { useRef, useEffect } from 'react';
import {SafeAreaView, Text, View, StyleSheet, Dimensions, Animated, StatusBar, ActivityIndicator,} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import logo from '../../assets/img/file.png'; 

export default function AnimationScreen() {
    const navigation = useNavigation(); 
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(0)).current;
    const textFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Inicia las animaciones
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

        // Navega al Login después de 3 segundos
        const timeout = setTimeout(() => {
            navigation.navigate('Login');
        }, 4000);

        // Limpia el timeout al desmontar el componente
        return () => clearTimeout(timeout);
    }, [navigation, scaleAnim, fadeAnim, translateAnim, textFadeAnim]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden />
            <View style={styles.contentContainer}>
                <Animated.Image
                    style={[
                        styles.image,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                    source={logo}
                />

                <Animated.View style={[styles.logoContainer, { transform: [{ translateX: translateAnim }] }]}>
                    <Text style={[styles.logoText]}>GYM </Text>
                    <Animated.Text style={[styles.logoText, { opacity: textFadeAnim }]}>
                        BROS
                    </Animated.Text>
                </Animated.View>
                <ActivityIndicator color="white" size="extra-large" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        top: '30%',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    text: {
        marginTop: 50,
        fontSize: 50,
        color: 'white',
    },
    logoText: {
        fontSize: 35,
        marginTop: 20,
        color: 'white',
        fontWeight: '900',
    },
    logoContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
});
