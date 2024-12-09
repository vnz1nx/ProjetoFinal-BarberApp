import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'; 
import logo from "../../assets/Ok.png";
import { useNavigation, useRoute } from '@react-navigation/native';

const SplashScreen2 = () => {
  
  const route = useRoute();
  const navigation = useNavigation();
  const { barbearia, user, email, senha } = route.params; 

  useEffect(() => {
    console.log("SplashScreen mounted");
    const timer = setTimeout(() => {
      navigation.replace("HomeApp", { user, barbearia, email, senha });
    }, 1200); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
      />
      <Text style={styles.title}>RESERVA REALIZADA COM SUCESSO!</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    top:-60,
  },
});

export default SplashScreen2;
