import axios from "axios";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const Cortes = () => {
  const [cortes, setCortes] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { barbearia, user, email, senha } = route.params; 
  
  const CORTES_API_URL = `http://localhost:8080/api/v2/barber/${barbearia.id}/cortes`;

  useEffect(() => {
    const fetchCortes = async () => {
      try {
        const response = await axios.get(CORTES_API_URL);
        setCortes(response.data);
      } catch (error) {
        alert("Erro ao buscar os dados dos cortes:", error);
      }
    };

    fetchCortes();
  }, [barbearia.id]);

  const handleReservar = (corte) => {
    navigation.navigate("AgendarCortes", { corte, barbearia, user, email, senha});
  };

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
      <Text style={styles.textoTopo}>
          Cortes
        </Text>
      </View>

      <FlatList
        data={cortes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contCorte}>
            <View style={styles.contImagem}>
              <Image source={{ uri: item.imagem }} style={styles.imagem} />
            </View>

            <View style={styles.contInfo}>
              <Text style={styles.nomeCorte}>{item.nomeCorte}</Text>
              <View style={styles.contValorTempo}>
                <Text>Valor: {item.valor}R$</Text>
                <Text>Tempo: {item.tempo}</Text>
              </View>
            </View>

            <View style={styles.contButReservar}>
              <TouchableOpacity style={styles.butReservar} onPress={() => handleReservar(item)}>
                <Text style={styles.textoReservar}>RESERVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.contCortes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width:"100%",
    flex: 1,
    alignContent:"flex-start",
    justifyContent:"flex-start",
  },

  topo: {
    width: "100%",
    height: 70,
    paddingTop:30,
    justifyContent: "center",
    alignItems: "center",
    borderEndEndRadius: 10,
    borderEndStartRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex:1,
  },

  contCortes: {
    width: "92%",
    marginTop: "10%",
  },

  contCorte: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  contImagem: {
    width: "25%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  imagem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },  
  textoTopo: {
    fontSize: 18,
    fontWeight: "bold",
  },

  contInfo: {
    width: "50%",
    padding: 10,
  },

  nomeCorte: {
    fontSize: 16,
    fontWeight: "bold",
  },

  contValorTempo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },

  contButReservar: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },

  butReservar: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#7CB9E8",
    width: "100%",
    height: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },

  textoReservar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize:12,
  },
});

export default Cortes;
