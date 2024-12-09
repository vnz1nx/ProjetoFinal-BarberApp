import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from "react-native";
import { useRoute,useNavigation } from "@react-navigation/native";
import axios from "axios";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const AgendarCortes = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { corte, barbearia, user, email, senha } = route.params || {};  

  const RESERVA_API_URL = `http://localhost:8080/api/v7/reserva`; 

  const dataAtual = new Date();
  const offsetAtual = dataAtual.getTimezoneOffset() * 60000;
  const dataReservaLocal = new Date(dataAtual.getTime() - offsetAtual);

  const [mesAtual, setMesAtual] = useState(dataAtual.getMonth());
  const [anoAtual, setAnoAtual] = useState(dataAtual.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState("");
  const [minutoSelecionado, setMinutoSelecionado] = useState("");


  const obterDiasDoCalendario = (mes, ano) => {
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay();

    const diasAntes = Array.from({ length: primeiroDiaDaSemana }, () => null); 
    const diasDoMes = Array.from({ length: diasNoMes }, (_, i) => i + 1);
    return [...diasAntes, ...diasDoMes];
  };

  const alterarMes = (direcao) => {
    if (direcao === "proximo") {
      if (mesAtual === 11) {
        setMesAtual(0);
        setAnoAtual(anoAtual + 1);
      } else {
        setMesAtual(mesAtual + 1);
      }
    } else {
      if (mesAtual === 0) {
        setMesAtual(11);
        setAnoAtual(anoAtual - 1);
      } else {
        setMesAtual(mesAtual - 1);
      }
    }
    setDiaSelecionado(null);
  };

  const confirmarReserva = async () => {
    if (diaSelecionado && horaSelecionada && minutoSelecionado) {
      if (horaSelecionada.length < 2 || minutoSelecionado.length < 2) {
        alert("Por favor, insira uma hora e minuto com dois dígitos.");
      } else {
        const horaInt = parseInt(horaSelecionada);
        const minutoInt = parseInt(minutoSelecionado);

        if (horaInt < 8 || horaInt > 20 || (horaInt === 18 && minutoInt > 0)) {
          alert("A reserva só pode ser feita entre 08:00 e 18:00.");
          return;
        }
  
        const dataReserva = new Date(
          anoAtual,
          mesAtual,
          diaSelecionado,
          horaInt,
          minutoInt,
          0
        );
        const offset = dataReserva.getTimezoneOffset() * 60000;
        const dataAjustada = new Date(dataReserva.getTime() - offset);
  
        try {
          const response = await axios.post(RESERVA_API_URL, {
            nomeCorte: corte.nomeCorte,
            valor: corte.valor,
            horario: dataAjustada.toISOString(),
            userId: user.id,
            barberId: barbearia.id,  
            nomeBarbearia: barbearia.nomeBarbearia,
            corteId: corte.id,
            dataReserva: dataReservaLocal.toISOString(),
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
  
          if (response.status >= 200 && response.status < 300) {
            navigation.navigate("SplashScreen2", { user, barbearia, corte, email, senha });
          } else {
            alert("Erro ao fazer a reserva. Tente novamente.");
          }          
        } catch (error) {
          alert("Erro ao fazer a reserva. Tente novamente.");
        }
      }
    } else {
      alert("Por favor, selecione uma data e um horário.");
    }
  };
  
  const diasDoCalendario = obterDiasDoCalendario(mesAtual, anoAtual);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.monthYearSelector}>
        <TouchableOpacity onPress={() => alterarMes("anterior")} style={styles.changeButton}>
          <Text style={styles.changeButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{meses[mesAtual]} {anoAtual}</Text>
        <TouchableOpacity onPress={() => alterarMes("proximo")} style={styles.changeButton}>
          <Text style={styles.changeButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.weekDays}>
          {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((day) => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.calendar}>
          {diasDoCalendario.map((dia, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.day,
                diaSelecionado === dia && styles.selectedDay,
                dia === null && styles.emptyDay,
              ]}
              disabled={dia === null}
              onPress={() => dia && setDiaSelecionado(dia)}
            >
              {dia && <Text style={[styles.dayText, diaSelecionado === dia && styles.selectedDayText]}>{dia}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.selectTimeText}>Horário:</Text>
      <View style={styles.timeInputsContainer}>
        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          maxLength={2}
          value={horaSelecionada}
          onChangeText={setHoraSelecionada}
        />
        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          maxLength={2}
          value={minutoSelecionado}
          onChangeText={setMinutoSelecionado}
        />
      </View>

      <View style={styles.corteInfo}>
        <View style={styles.corteInfoRow}>
          <Text style={styles.corteNome}>{corte.nomeCorte}</Text>
          <View>
            <Text style={styles.corteValor}>R$ {corte.valor.toFixed(2)}</Text>
            {horaSelecionada && minutoSelecionado ? (
              <Text style={styles.corteTempo}>
                Horário: {horaSelecionada.padStart(2, "0")}:{minutoSelecionado.padStart(2, "0")}
              </Text>
            ) : (
              <Text style={styles.corteTempo}>Adicione o horário acima</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.reserveButton} onPress={confirmarReserva}>
          <Text style={styles.reserveButtonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyDay: { 
    backgroundColor: "transparent", 
    borderColor: "transparent" 
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingBottom: 20, 
    top:60
  },
  corteInfo: {
    fontSize: 16,
    color: "#333",
  },
  monthYearSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingVertical: 10,
  },
  changeButton: {
    padding: 5,
  },
  changeButtonText: {
    fontSize: 20,
    color: "#007AFF",
  },
  monthYearText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
  },
  calendarContainer: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 5,
    margin: '2%',
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  calendar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
  },
  day: { width: "14.285%",
    height: 60, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 5
  },
  dayText: { 
    fontSize: 16, 
    color: "#333" 
  },
  selectedDay: { 
    backgroundColor: "#007AFF", 
    borderRadius: 10 
  },
  selectedDayText: { 
    color: "#fff" 
  },
  emptyDay: { 
    backgroundColor: "transparent", 
    borderColor: "transparent" 
  },
  selectTimeText: { 
    fontSize: 18, 
    marginBottom: 5,
    right:"35%",
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    justifyContent:'flex-start',
    alignContent:"flex-start",
    width: "90%",
    height: "7%",
  },
  timeInput: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlign:"center",
    fontSize: 16,
  },
  corteInfo: {
    width: "90%",
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  corteInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  corteNome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  corteValor: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "600",
  },
  corteTempo: {
    fontSize: 16,
    color: "#888",
    marginTop: 4,
  },
  reserveButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  reserveButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },  
});

export default AgendarCortes;
