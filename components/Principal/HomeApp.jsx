import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import iconsUser from "../../assets/icons8.png"
import iconsHorario from "../../assets/icons8-agenda-30.png"

const HomeApp = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user,email,senha } = route.params;
  const { corte, barbearia } = route.params || {}; 

  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BARBER_API_URL = "http://localhost:8080/api/v2/barber";

  useEffect(() => {
    const fetchBarbearias = async () => {
      try {
        const response = await axios.get(BARBER_API_URL);
        setBarbearias(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Erro ao buscar os dados da barbearia.");
      }
    };

    fetchBarbearias();
  }, []);

  const handlePress = (barbearia, user) => {
    navigation.navigate("Cortes", { barbearia, user,email,senha });
  };

  const goToAgendamento = () => {
    navigation.navigate("Agendamentos", { user,email,senha });
  };

  const goToPerfil = () => {
    navigation.navigate("PerfilUsuario", { user,email,senha});
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
        <TouchableOpacity style={styles.logoutButton} onPress={goToPerfil}>
          <Text style={styles.logoutButtonText}>Voltar para o perfil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.textoTopo}>
        Bem Vindo(a): {user.usuario.split(" ")[0].charAt(0).toUpperCase() + user.usuario.split(" ")[0].slice(1).toLowerCase()}
        </Text>
        
        <View style={styles.botoesTopo}>
          <TouchableOpacity onPress={goToAgendamento} style={styles.botaoCirculo}>
            <Image
              source={iconsHorario}
              style={styles.iconImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToPerfil} style={styles.botaoCirculo}>
            <Image
              source={iconsUser}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        style={styles.contBarbearia}
        data={barbearias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item, user)}>
            <View style={styles.contSuperior}>
              <View style={styles.contTexto}>
                <Text style={styles.nomeBarbearia}>{item.nomeBarbearia}</Text>
                <Text style={styles.distancia}>{item.distancia}</Text>
              </View>
              <View style={styles.contImagem}>
                <Image
                  style={styles.image}
                  source={{
                    uri: item.imagem,
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:"100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
  },

  topo: {
    width: "100%",
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderEndEndRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 1, 
  },

  textoTopo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "5%",
  },

  botoesTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    top: 30,
    paddingHorizontal: "5%",
  },

  botaoCirculo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  contBarbearia: {
    width: "97%",
    height: "50%",
    marginTop: "20%",
  },

  contSuperior: {
    flexDirection: "column",
    borderRadius: 10,
    marginBottom: "2%",
    marginTop: "2%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 2.5,
  },

  contTexto: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },

  nomeBarbearia: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

  distancia: {
    fontSize: 14,
    color: "grey",
    marginTop: 5,
  },

  contImagem: {
    width: "100%",
    height: 150,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },

  logoutButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },

  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeApp;
