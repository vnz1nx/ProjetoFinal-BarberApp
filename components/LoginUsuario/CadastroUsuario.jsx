import { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, TextInput, View, Image, Alert } from "react-native";
import logo from "../../assets/BarberShop.png";
import axios from "axios";
import olho from "../../assets/olho-aberto.png"
import olhofechado from "../../assets/fechar-o-olho.png"

const CadastroUsuario = () => {
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false); 

  const PERSON_API_URL = "http://localhost:8080/api/v1/people";

  const validateInputs = () => {
    const newErrors = {};
    if (!usuario) newErrors.usuario = "Usuário é obrigatório.";
    if (!email) { 
      newErrors.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de e-mail inválido.";
    }

    if (!senha) newErrors.senha = "Senha é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verificaLogin = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/people',{
          usuario,
          email,
          senha,
      })
      console.log("Usuario registrado com sucesso:",response.data)
      setSuccessMessage("Cadastro realizado com sucesso!");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
          setSuccessMessage("Esse email já está em uso. Tente outro.");
        } else {
          console.error("Erro ao adicionar usuários:", err);
          Alert.alert("Erro", "Não foi possível concluir o cadastro.");
      };
    }
  };

  const handleRegister = async () => {
  const isValid = validateInputs();
  if (isValid) {
    await verificaLogin();
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.bloco1}>
        <Text style={styles.TextBarber}>Barber Show`s</Text>
        <Image source={logo} style={styles.logo} />
      </View>

      <View style={styles.bloco2}>
        <Text>CADASTRO</Text>
      </View>

      <View style={styles.bloco3}>
        <TextInput
          style={styles.inputTexto}
          placeholder="USUÁRIO"
          value={usuario}
          onChangeText={(text) => {
            setUsuario(text);
            setErrors((prev) => ({ ...prev, usuario: undefined }));
            setSuccessMessage("");
          }}
          placeholderTextColor="grey"
        />
        {errors.usuario && (
          <Text style={styles.errorText}>{errors.usuario}</Text>
        )}
      </View>

      <View style={styles.bloco4}>
        <TextInput
          style={styles.inputTexto}
          placeholder="EMAIL"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: undefined }));
            setSuccessMessage("");
          }}
          placeholderTextColor="grey"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.bloco5}>
        <TextInput
          style={styles.inputTexto}
          placeholder="SENHA"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setErrors((prev) => ({ ...prev, senha: undefined }));
            setSuccessMessage("");
          }}
          placeholderTextColor="grey"
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

      <View style={styles.bloco6}>
        <TouchableOpacity style={styles.buttonCadastro} onPress={handleRegister}>
          <Text style={{ color: "#fff" }}>CADASTRAR</Text>
        </TouchableOpacity>
        {successMessage && (
          <Text style={styles.successText}>{successMessage}</Text>
        )}
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
    height: "35%",
    width: "100%",
  },
  bloco2: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    fontSize: 25,
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
  bloco6: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5%",
    width: "100%",
    margin: "2%",
  },
  buttonCadastro: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "95%",
    width: "30%",
    borderWidth: 1,
    borderColor: "#00275c",
    borderRadius: 9,
    backgroundColor: "#240f06",
    color: "#fff",
  },
  inputTexto: {
    display: "flex",
    width: "65%",
    height: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 7,
    fontSize: 18,
    paddingLeft: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: -60,
  },
  TextBarber: {
    fontSize: 25,
    color: "#00275c",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: "17%",
    marginTop: 2,
  },
  successText: {
    color: "green",
    fontSize: 14,
    marginTop: 10,
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

export default CadastroUsuario;
