import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import newCallStyles from '../../assets/styles/newCall.styles';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ CORRETO AGORA

import { useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../constants/api";

// FUNÇÃO DE FORMATAÇÃO: Aplica a máscara HH:MM
const formatTimeInput = (input) => {
  let cleaned = input.replace(/\D/g, '');
  cleaned = cleaned.substring(0, 4);

  if (cleaned.length >= 2) {
    const hours = parseInt(cleaned.substring(0, 2), 10);
    if (hours > 23) cleaned = '23' + cleaned.substring(2);
  }
  if (cleaned.length === 4) {
    const minutes = parseInt(cleaned.substring(2, 4), 10);
    if (minutes > 59) cleaned = cleaned.substring(0, 2) + '59';
  }

  if (cleaned.length > 2) {
    return cleaned.substring(0, 2) + ':' + cleaned.substring(2);
  }
  return cleaned;
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
  const { user } = useUser();
  const clerkId = user?.id;

  const [description, setDescription] = useState('');
  const [presencial, setPresencial] = useState(true);
  const [remoto, setRemoto] = useState(false);

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [time, setTime] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const confirmButtonStyles = {
    padding: 12,
    backgroundColor: '#0611afff',
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

  const formatDateString = (dateObj) => {
    if (!dateObj) return '';
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAlterarDate = () => {
    setTempDate(date);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
      }
      setShowDatePicker(false);
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }

    if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  const handleConfirmDate = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const handleAlterarTime = () => {
    setIsEditingTime(!isEditingTime);
  };

  const handleSelectPresencial = () => {
    setPresencial(!presencial);
    if (!presencial) setRemoto(false);
  };

  const handleSelectRemoto = () => {
    setRemoto(!remoto);
    if (!remoto) setPresencial(false);
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

      const horarioSQL = time;
      const dataSQL = date.toISOString().split("T")[0];

      const checkResponse = await fetch(`${API_URL}/chamadas/check?data=${dataSQL}&horario=${horarioSQL}`);
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        Alert.alert("Horário Indisponível", "Já existe um chamado agendado para essa data e horário.");
        return;
      }

      const response = await fetch(`${API_URL}/chamadas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario,
          nomeUsuario: userData.nome,
          descChamada: description,
          presencial,
          horario: horarioSQL,
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}   // ✅ Corrigido
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        {/* Header */}
        <View style={newCallStyles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={newCallStyles.backButton}>
            <Ionicons name="chevron-back" size={24} color={newCallStyles.headerTitle.color} />
          </TouchableOpacity>
          <Text style={newCallStyles.headerTitle}>Novo Chamado</Text>
        </View>

        <ScrollView style={newCallStyles.scrollViewContent}>
          <Text style={newCallStyles.stepTitle}>Chamado: Problema Técnico</Text>

          {/* Área de texto */}
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
            <CustomCheckBox title="Presencial" checked={presencial} onPress={handleSelectPresencial} />
            <CustomCheckBox title="Acesso Remoto" checked={remoto} onPress={handleSelectRemoto} />
          </View>

          {/* Card de data */}
          <View style={newCallStyles.dateTimeCard}>
            <View style={newCallStyles.dateTimeLeft}>
              <Ionicons name="calendar-outline" size={24} color="#888" />
              <View>
                <Text style={newCallStyles.dateTimeLabel}>Data</Text>
                <Text style={newCallStyles.dateTimeValue}>{formatDateString(date)}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleAlterarDate}>
              <Text style={newCallStyles.alterarButtonText}>Alterar</Text>
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <View style={{ backgroundColor: Platform.OS === 'ios' ? '#F2F2F2' : 'transparent' }}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
                textColor="#000"
              />

              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={handleConfirmDate} style={confirmButtonStyles}>
                  <Text style={confirmButtonTextStyles}>Confirmar Data</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Card de horário */}
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

        {/* Botão finalizar */}
        <View style={newCallStyles.finishButtonContainer}>
          <TouchableOpacity style={newCallStyles.finishButton} onPress={handleFinishCall}>
            <Text style={newCallStyles.finishButtonText}>Finalizar Chamado</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewCallScreen;
