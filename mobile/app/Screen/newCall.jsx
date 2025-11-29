import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
//import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
//import styles from "./NovoChamado.styles";

export default function NovoChamado({ navigation }) {
  const [descricao, setDescricao] = useState("");
  const [presencial, setPresencial] = useState(true);
  const [acessoRemoto, setAcessoRemoto] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [horario, setHorario] = useState("13:00");
  const [endereco, setEndereco] = useState("Meu Endereço");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2C136C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Chamado</Text>
      </View>

      {/* Número do Chamado */}
      <Text style={styles.chamadoTitle}>3° Chamado: Problema e Técnico</Text>

      {/* Descrição */}
      <TextInput
        style={styles.input}
        placeholder="Por que você está criando esse chamado?"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {/* Tipo de atendimento */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setPresencial(!presencial);
          }}
        >
          <Ionicons
            name={presencial ? "checkbox" : "square-outline"}
            size={20}
            color="#2C136C"
          />
          <Text style={styles.checkboxLabel}>Presencial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setAcessoRemoto(!acessoRemoto);
          }}
        >
          <Ionicons
            name={acessoRemoto ? "checkbox" : "square-outline"}
            size={20}
            color="#2C136C"
          />
          <Text style={styles.checkboxLabel}>Acesso Remoto</Text>
        </TouchableOpacity>
      </View>

      {/* Calendário 
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#2C136C" },
        }}
        theme={{
          todayTextColor: "#2C136C",
          arrowColor: "#2C136C",
        }}
        style={styles.calendar}
      />
      */}

      {/* Horário */}
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color="#2C136C" />
        <Text style={styles.infoText}>{horario}</Text>
        <TouchableOpacity>
          <Text style={styles.alterarText}>Alterar</Text>
        </TouchableOpacity>
      </View>

      {/* Endereço */}
      <View style={styles.infoRow}>
        <Ionicons name="home-outline" size={20} color="#2C136C" />
        <Text style={styles.infoText}>{endereco}</Text>
        <TouchableOpacity>
          <Text style={styles.alterarText}>Alterar</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Finalizar */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Finalizar Chamado</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
