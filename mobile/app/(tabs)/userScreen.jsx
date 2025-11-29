import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserStyles as styles } from "../../assets/styles/user.styles";
import { useRouter } from "expo-router";


import { ChamadosAPI } from "../../services/chamadosAPI";
import { useState, useEffect } from "react";

import { API_URL } from "../../constants/api";
import { useClerk, useUser } from "@clerk/clerk-expo";

const UserScreen = () => {
  const router = useRouter();
  //logout
  const { signOut } = useClerk();
  const { user } = useUser();



  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");


  const [chamados, setChamados] = useState([]);



  const userId = 2;

  const loadChamados = async () => {
    try {
      const data = await ChamadosAPI.getChamadosByUsuario(userId);
      setChamados(data);
    } catch (error) {
      console.log("Erro ao carregar chamados:", error);
    }
  };

  const handleToggleUpdate = async () => {

    const response = await fetch(`${API_URL}/usuarios/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        senha,
        cep
      }),
    });

    if (response.ok) {
      const updateUser = await response.json();
      console.log("Usuário atualizado:", updateUser);

    } else {
      console.log("Erro ao atualizar usuário", response.statusText);
    }
  }

  useEffect(() => {
    loadChamados();
  }, []);


  //SignOut
  const handleSignOut = () => {
    Alert.alert("Logout", "Você tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Meu Perfil</Text>

        <Ionicons name="ellipsis-vertical" size={22} color="#1A1A1A" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Card Chamados */}
        <View style={styles.cardChamados}>
          <Text style={styles.chamadosTitle}>Chamados</Text>
          <Text style={styles.chamadosCount}>{chamados?.length ?? 0}</Text>
        </View>

        {/* Linhas de Alteração */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Nome</Text>
          <TouchableOpacity>
            <Text style={styles.rowAction}>Alterar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Senha</Text>
          <TouchableOpacity onPress={<TextInput>

          </TextInput>}>
            <Text style={styles.rowAction}>Alterar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>CEP</Text>
          <TouchableOpacity>
            <Text style={styles.rowAction}>Alterar</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Excluir Conta */}
        <TouchableOpacity style={styles.btnExcluir}>
          <Text style={styles.btnExcluirText}>Excluir Conta</Text>
        </TouchableOpacity>

        {/* Botão Logout */}
        <TouchableOpacity style={styles.btnLogout} onPress={handleSignOut}>
          <Text style={styles.btnLogoutText}>Fazer Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default UserScreen;