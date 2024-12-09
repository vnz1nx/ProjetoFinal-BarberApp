import axios from "axios";
import React, { useState } from "react";
import logo from "../../assets/BarberShop.png";
import { useNavigation } from "@react-navigation/native";
import olho from "../../assets/olho-aberto.png"
import olhofechado from "../../assets/fechar-o-olho.png"
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, Alert } from "react-native";

const LoginUsuario = () => {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const PERSON_API_URL = "http://localhost:8080/api/v1/people/login";

  const validateInputs = () => {
    const newErrors = {};
    if (!usuario) newErrors.usuario = "Usuário é obrigatório.";
    if (!senha) newErrors.senha = "Senha é obrigatória.";

    setErrors(newErrors);
    setAuthError("");

    return Object.keys(newErrors).length === 0;
  };

  const verificaUsuario = async () => {
    if (!validateInputs()) return;
    try {
      const response = await axios.post(PERSON_API_URL, {
        email: usuario,
        senha: senha,
      });

      if (response.status === 200) {
        const user = response.data;
        navigation.navigate("HomeApp", {
          user,
          email: usuario,
          senha: senha,
        });
      } else {
        setAuthError("Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      Alert.alert("Erro", "Falha ao carregar!");
      setAuthError("Esse login não existe.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bloco1}>
        <Text style={styles.TextBarber}>Barber Show`s</Text>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.bloco2}>
        <Text>LOGIN</Text>
      </View>

      <View style={styles.bloco3}>
        <TextInput
          style={styles.inputTexto}
          placeholder="Email"
          value={usuario}
          onChangeText={(text) => {
            setUsuario(text);
            setErrors((prev) => ({ ...prev, usuario: undefined }));
          }}
          placeholderTextColor={"grey"}
        />
        {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}
      </View>

      <View style={styles.bloco4}>
        <TextInput
          style={styles.inputTexto}
          placeholder="Senha"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setErrors((prev) => ({ ...prev, senha: undefined }));
          }}
          placeholderTextColor={"grey"}
          secureTextEntry={!senhaVisivel} 
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setSenhaVisivel(!senhaVisivel)}
        >
          <Image
              source={
                senhaVisivel
              ? olho : olhofechado}
              style={styles.iconImage}
            />
        </TouchableOpacity>
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
      </View>
      {authError && (
        <View style={styles.authErrorContainer}>
          <Text style={styles.authErrorText}>{authError}</Text>
        </View>
      )}
      <View style={styles.bloco5}>
        <TouchableOpacity style={styles.buttonLogin} onPress={verificaUsuario}>
          <Text style={{ color: "#fff" }}>LOGAR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bloco6}>
        <Text style={styles.textCadastro}>
          Primeiro acesso?{" "}
          <Text
            style={styles.cadastroCor}
            onPress={() => navigation.navigate("CadastroUsuario")}
          >
            Cadastro
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: "100%",
    fontFamily: "LEMONMILK-Regular",
    backgroundColor: "white",
  },
  bloco1: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    bottom: -70,
    height: "35%",
    width: "100%",
  },
  bloco2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    fontSize: "25px",
  },
  bloco3: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    margin: "2%",
  },
  bloco4: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    margin: "2%",
  },
  bloco5: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    margin: "2%",
  },
  buttonLogin: {
    justifyContent: "center",
    alignItems: "center",
    height: "95%",
    width: "20%",
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 9,
    backgroundColor: "#240f06",
  },
  bloco6: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    margin: "2%",
  },
  inputTexto: {
    width: "65%",
    height: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 7,
    fontSize: 18,
    paddingLeft:10,
  },
  cadastroCor: {
    color: "#00275c",
  },
  TextBarber: {
    fontSize: 25,
    color: "#00275c",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 80,
  },
  textCadastro: {
    fontSize: 15,
    color: "#240f06",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: "17%",
    marginTop: 2,
  },
  authErrorContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  authErrorText: {
    color: "red",
    fontSize: 14,
  },
  iconImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 10, 
  },
  eyeButton: {
    position: "absolute",
    right: 30,
    top: "50%",
    transform: [{ translateY: -12 }], 
  },
});

export default LoginUsuario;
