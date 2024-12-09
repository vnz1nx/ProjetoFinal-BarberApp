import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'; 
import logo from "../../assets/BarberShop.png";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    console.log("SplashScreen mounted");
    const timer = setTimeout(() => {
      navigation.replace('LoginUsuario');
    }, 1200); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#240f06',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
});

export default SplashScreen;
