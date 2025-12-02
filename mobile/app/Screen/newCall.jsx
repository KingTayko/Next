import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import newCallStyles from '../../assets/styles/newCall.styles';
import { useRouter } from "expo-router";

import { useUser } from "@clerk/clerk-expo"
// Assumindo que você tem este arquivo de constantes
import { API_URL } from "../../constants/api";

// FUNÇÃO DE FORMATAÇÃO: Aplica a máscara HH:MM
const formatTimeInput = (input) => {
  let cleaned = input.replace(/\D/g, '');
  cleaned = cleaned.substring(0, 4);

  if (cleaned.length >= 2) {
    const hours = parseInt(cleaned.substring(0, 2), 10);
    if (hours > 23) { cleaned = '23' + cleaned.substring(2); }
  }
  if (cleaned.length === 4) {
    const minutes = parseInt(cleaned.substring(2, 4), 10);
    if (minutes > 59) { cleaned = cleaned.substring(0, 2) + '59'; }
  }

  let formatted = cleaned;
  if (cleaned.length > 2) {
    formatted = cleaned.substring(0, 2) + ':' + cleaned.substring(2);
  }
  return formatted;
};

// Componente Customizado de Checkbox
const CustomCheckBox = ({ title, checked, onPress }) => (
  <TouchableOpacity style={newCallStyles.checkboxContainer} onPress={onPress}>
    <View style={[newCallStyles.box, checked && newCallStyles.checkedBox]}>
      {checked && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
    <Text style={newCallStyles.checkboxLabel}>{title}</Text>
  </TouchableOpacity>
);

const NewCallScreen = () => {
  const router = useRouter();

  // Conecta o usuário via Clerk
  const { user } = useUser();
  const clerkId = user?.id; // ID do Clerk

  const [description, setDescription] = useState('');
  const [presencial, setPresencial] = useState(true);
  const [remoto, setRemoto] = useState(false);

  // ESTADO DA DATA: Armazena a data confirmada como um objeto Date
  const [date, setDate] = useState(new Date(2026, 2, 21)); // Março é mês 2 (0-based)
  // NOVO ESTADO: Armazena a data temporária enquanto o usuário está rolando o spinner
  const [tempDate, setTempDate] = useState(new Date(2026, 2, 21));
  // ESTADO DO HORÁRIO
  const [time, setTime] = useState('13:00');

  // NOVO ESTADO: Controla a visibilidade do DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  // ESTADO DA EDIÇÃO DO HORÁRIO
  const [isEditingTime, setIsEditingTime] = useState(false);

  // --- Estilos Locais para o Botão Confirmar (para garantir visualização) ---
  const confirmButtonStyles = {
    padding: 12,
    backgroundColor: '#0611afff', // Um azul vibrante
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  };

  const confirmButtonTextStyles = {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  };

  // --- Funções de Handler ---

  // Função para formatar o objeto Date para a string DD/MM/AAAA (para exibição e API)
  const formatDateString = (dateObj) => {
    if (!dateObj) return '';
    // Garante que o formato é DD/MM/AAAA, crucial para o backend
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Inicializa tempDate e exibe o DatePicker
  const handleAlterarDate = () => {
    setTempDate(date); // Inicia a data temporária com a data atual
    setShowDatePicker(true);
  };

  // FUNÇÃO DE ALTERAÇÃO DE DATA (Manipula a rolagem)
  const onDateChange = (event, selectedDate) => {
    // No Android (display 'default'), o evento 'set' é o OK/Confirmar
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
      }
      // Fecha em qualquer interação no Android
      setShowDatePicker(false);
    } else {
      // No iOS (display 'spinner'), atualiza apenas o estado temporário
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
    // Se o usuário cancelou (e.g., tocou fora do modal/picker no Android), esconde.
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  // Confirma a data temporária para a data principal e fecha o seletor
  const handleConfirmDate = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const handleAlterarTime = () => {
    setIsEditingTime(!isEditingTime);
    if (isEditingTime) {
      console.log(`Horário Salvo: ${time}`);
    }
  };

  const handleSelectPresencial = () => {
    if (presencial) {
      setPresencial(false);
    } else {
      setPresencial(true);
      setRemoto(false);
    }
  };

  const handleSelectRemoto = () => {
    if (remoto) {
      setRemoto(false);
    } else {
      setRemoto(true);
      setPresencial(false);
    }
  };

  const handleFinishCall = async () => {
  if (description.trim().length === 0) {
    Alert.alert('Erro', 'A descrição não pode estar vazia.');
    return;
  }

  if (!clerkId) {
    Alert.alert('Erro', 'Usuário não autenticado.');
    return;
  }

  if (time.length !== 5 || time.indexOf(':') !== 2) {
    Alert.alert('Erro', 'Por favor, insira um horário válido no formato HH:MM.');
    return;
  }

  try {
    const userResponse = await fetch(`${API_URL}/usuarios/by-clerk/${clerkId}`);
    const userData = await userResponse.json();

    if (!userData?.id) {
      Alert.alert("Erro", "Não foi possível localizar o usuário no banco.");
      return;
    }

    const idUsuario = userData.id;

    // ✅ AGORA SEM SEGUNDOS
    const horarioSQL = time;   // EX: "13:00"
    const dataSQL = date.toISOString().split("T")[0]; // "2026-03-21"

    // 3️⃣ VERIFICAÇÃO DE HORÁRIO
    const checkResponse = await fetch(
      `${API_URL}/chamadas/check?data=${dataSQL}&horario=${horarioSQL}`
    );

    const checkData = await checkResponse.json();

    if (checkData.exists) {
      Alert.alert(
        "Horário Indisponível",
        "Já existe um chamado agendado para essa data e horário."
      );
      return;
    }

    // 4️⃣ CRIA O CHAMADO
    const response = await fetch(`${API_URL}/chamadas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUsuario,
        nomeUsuario: userData.nome,
        descChamada: description,
        presencial,
        horario: horarioSQL,  // "13:00"
        data: dataSQL,
        cepChamada: userData.cep
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      Alert.alert("Erro", result.error || "Não foi possível criar o chamado");
      return;
    }

    Alert.alert("Sucesso", "Chamado criado com sucesso!");
    router.back();

  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao conectar ao servidor.");
  }
};


  return (
    <SafeAreaView style={newCallStyles.safeArea}>
      {/* Header */}
      <View style={newCallStyles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={newCallStyles.backButton}>
          <Ionicons name="chevron-back" size={24} color={newCallStyles.headerTitle.color} />
        </TouchableOpacity>
        <Text style={newCallStyles.headerTitle}>Novo Chamado</Text>
      </View>

      <ScrollView style={newCallStyles.scrollViewContent}>

        <Text style={newCallStyles.stepTitle}>Chamado: Problema Técnico</Text>

        {/* Área de Texto */}
        <TextInput
          style={newCallStyles.textArea}
          onChangeText={setDescription}
          value={description}
          placeholder="Por que você está criando esse chamado?"
          placeholderTextColor="#888"
          multiline={true}
          numberOfLines={4}
        />

        {/* Checkboxes */}
        <View style={newCallStyles.checkboxRow}>
          <CustomCheckBox
            title="Presencial"
            checked={presencial}
            onPress={handleSelectPresencial}
          />
          <CustomCheckBox
            title="Acesso Remoto"
            checked={remoto}
            onPress={handleSelectRemoto}
          />
        </View>

        {/* Card de Data */}
        <View style={newCallStyles.dateTimeCard}>
          <View style={newCallStyles.dateTimeLeft}>
            <Ionicons name="time-outline" size={24} color="#888" />
            <View>
              <Text style={newCallStyles.dateTimeLabel}>Data</Text>
              {/* Exibe a data formatada */}
              <Text style={newCallStyles.dateTimeValue}>{formatDateString(date)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleAlterarDate}>
            <Text style={newCallStyles.alterarButtonText}>Alterar</Text>
          </TouchableOpacity>
        </View>

        {/* DateTimePicker Condicional com Lógica de Confirmação */}
        {showDatePicker && (
          <View style={{ backgroundColor: Platform.OS === 'ios' ? '#F2F2F2' : 'transparent' }}>
            <DateTimePicker
              testID="dateTimePicker"
              value={tempDate} // Usa a data temporária
              mode="date" // Modo de data
              // Usa 'spinner' (roleta) no iOS com cor preta, e 'default' (modal) no Android
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              textColor="#000000" // Cor da fonte preta (funciona para o spinner iOS e Android)
              onChange={onDateChange}
              minimumDate={new Date()} // Opcional: Impedir seleção de data passada
            />

            {/* Botão de Confirmação customizado para iOS (aparece junto com o spinner) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={handleConfirmDate}
                style={confirmButtonStyles}
              >
                <Text style={confirmButtonTextStyles}>Confirmar Data</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Card de Horário (mantido editável) */}
        <View style={newCallStyles.dateTimeCard}>
          <View style={newCallStyles.dateTimeLeft}>
            <Ionicons name="time-outline" size={24} color="#888" />
            <View>
              <Text style={newCallStyles.dateTimeLabel}>Horário</Text>
              {isEditingTime ? (
                <TextInput
                  style={newCallStyles.dateTimeValueInput}
                  onChangeText={(text) => setTime(formatTimeInput(text))}
                  value={time}
                  keyboardType="numeric"
                  maxLength={5}
                  autoFocus={true}
                  placeholder="HH:MM"
                />
              ) : (
                <Text style={newCallStyles.dateTimeValue}>{time}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity onPress={handleAlterarTime}>
            <Text style={newCallStyles.alterarButtonText}>
              {isEditingTime ? 'Confirmar' : 'Alterar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />

      </ScrollView>

      {/* Botão Finalizar Chamado */}
      <View style={newCallStyles.finishButtonContainer}>
        <TouchableOpacity style={newCallStyles.finishButton} onPress={handleFinishCall}>
          <Text style={newCallStyles.finishButtonText}>Finalizar Chamado</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default NewCallScreen;