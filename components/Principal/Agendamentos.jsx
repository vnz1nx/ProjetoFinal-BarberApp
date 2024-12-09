import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdowns, setCountdowns] = useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params || {};
  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      setError("ID do usuário não fornecido.");
      return;
    }
  
    const fetchAgendamentos = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v7/reserva/usuario/${user.id}`);
        setAgendamentos(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Erro ao buscar agendamentos.");
        console.error("Erro ao buscar agendamentos:", error);
      }
    };
  
    fetchAgendamentos();
  }, [user]);
  
  const handleDelete = async (id) => {
    try {
      console.log(`Deletando agendamento com id: ${id}`);
      await axios.delete(`http://localhost:8080/api/v7/reserva/${id}`);
      setAgendamentos((prevAgendamentos) =>
        prevAgendamentos.filter((agendamento) => agendamento.id !== id)
      );
      console.log(`Agendamento com id: ${id} deletado com sucesso.`);
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error);
      Alert.alert("Erro", "Não foi possível excluir o agendamento.");
    }
  };
  
  const getCountdown = (agendamentoTime) => {
    const now = new Date();
    const agendamentoDate = new Date(agendamentoTime);
    const timeDiff = agendamentoDate - now;

    if (timeDiff <= 0) {
      return null;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  useEffect(() => {
    const intervals = {};

    agendamentos.forEach((agendamento) => {
      const agendamentoTime = new Date(agendamento.horario);

      if (agendamentoTime > new Date()) {
        intervals[agendamento.id] = setInterval(() => {
          const countdown = getCountdown(agendamento.horario);

          if (!countdown) {
            clearInterval(intervals[agendamento.id]);
            handleDelete(agendamento.id);
            return;
          }

          setCountdowns((prevCountdowns) => ({
            ...prevCountdowns,
            [agendamento.id]: countdown,
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [agendamentos]);

  const formatCountdown = (countdown) => {
    if (!countdown) return "Tempo expirado";
    const { hours, minutes, seconds } = countdown;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} às ${date.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b84c5" />
        <Text>Carregando agendamentos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (agendamentos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.textoTopo}>Agendamentos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {agendamentos.map((agendamento) => {
          const countdown = countdowns[agendamento.id];
          return (
            <View key={agendamento.id} style={styles.agendamentoCard}>
              <Text style={styles.label}>Barbearia:</Text>
              <Text style={styles.text}>{agendamento.nomeBarbearia || "Não definido"}</Text>

              <Text style={styles.label}>Corte:</Text>
              <Text style={styles.text}>{agendamento.nomeCorte || "Não definido"}</Text>

              <Text style={styles.label}>Data e Hora:</Text>
              <Text style={styles.text}>{formatDateTime(agendamento.horario)}</Text>

              <Text style={styles.label}>Valor:</Text>
              <Text style={styles.text}>R$ {agendamento.valor.toFixed(2)}</Text>

              <Text style={styles.label}>Contagem Regressiva:</Text>
              <Text style={styles.countdownText}>{formatCountdown(countdown)}</Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(agendamento.id)}
              >
                <Text style={styles.deleteButtonText}>Cancelar Agendamento</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  topo: {
    width: "100%",
    height: 70,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderEndEndRadius: 10,
    borderEndStartRadius: 10,
    shadowColor: "#000000",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 1,
  },
  scrollContainer: {
    paddingTop: 100,
    paddingHorizontal: "5%",
  },
  agendamentoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
  },
  textoTopo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  countdownText: {
    fontSize: 16,
    color: "#ff9900",
    fontWeight: "bold",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
});

export default Agendamentos;
