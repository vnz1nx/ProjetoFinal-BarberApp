import React, { useState, useEffect } from "react";
import {StyleSheet,View,Text,Image,TextInput,TouchableOpacity,ActivityIndicator,Alert,} from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const PerfilUsuario = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const route = useRoute();
  const navigation = useNavigation();
  const { user, email, senha } = route.params || {};

  const defaultAvatar = "https://img2.gratispng.com/20180529/hao/avpqn3sar.webp";

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("ID do usuário não fornecido.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/people/${user.id}`);
        setUserData(response.data);
        setNewName(response.data.usuario || "");
        setNewEmail(email || "");
        setNewPassword(senha || "");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Erro ao buscar dados do usuário.");
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    navigation.replace("LoginUsuario");
  };

  const handleUpdate = async () => {
    try {
      const updates = {};
      if (newName.trim() && newName !== userData.usuario) updates.usuario = newName.trim();
      if (newEmail.trim() && newEmail !== userData.email) updates.email = newEmail.trim();
      if (newPassword.trim() && newPassword !== userData.senha) updates.senha = newPassword.trim();

      const response = await axios.put(`http://localhost:8080/api/v1/people/${user.id}`,
        updates,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserData((prev) => ({ ...prev, ...updates }));
        setUpdateMessage("Informações atualizadas com sucesso!");

        if (updates.email || updates.senha) {
          setTimeout(() => {
            setUpdateMessage("");
            handleLogout(); 
          }, 1000);
        } else {
          setTimeout(() => {
            setUpdateMessage("");
          }, 1000);
        }
      } else {
        Alert.alert("Erro", "Algo deu errado ao tentar atualizar as informações.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar as informações.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b84c5" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
      <Text style={styles.textoTopo}>
          Perfil
        </Text>
      </View>

      {userData && (
        <>
          <Image
            source={{ uri: userData.foto || defaultAvatar }}
            style={styles.avatar}
          />
          <Text style={styles.email}>
            Data de criação da conta: {new Date(userData.createdAt).toLocaleDateString()}
          </Text>

          <TextInput
            placeholder="Novo nome"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <TextInput
            placeholder="Novo e-mail"
            value={newEmail}
            onChangeText={setNewEmail}
            style={styles.input}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              style={[styles.input, styles.passwordInput]}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showNewPassword ? "visibility" : "visibility-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {updateMessage ? (
            <View style={styles.updateMessage}>
              <Text style={styles.updateMessageText}>{updateMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Alterar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width:"100%",
    flex: 1,
    alignItems:"center",
    justifyContent:"flex-start",
  },
  updateMessage: {
    backgroundColor: "#d4edda",
    padding: "2%",
    borderRadius: 5,
    marginBottom: "5%",
    marginTop: "5%",
  },
  updateMessageText: {
    color: "#155724",
    fontWeight: "bold",
  },
  topo: {
    width: "100%",
    height: 70,
    paddingTop:30,
    justifyContent: "center",
    alignItems: "center",
    borderEndEndRadius: 10,
    borderEndStartRadius: 10,
    position: "absolute",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textoTopo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 120,
    resizeMode: "cover",
  },
  email: {
    fontSize: 18,
    color: "gray",
    marginBottom: 10,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 5,
    marginLeft: 5,
  },
  updateButton: {
    backgroundColor: "#4682B4",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default PerfilUsuario;
