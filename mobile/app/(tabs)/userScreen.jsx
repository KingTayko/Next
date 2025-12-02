import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { UserStyles as styles } from "../../assets/styles/user.styles";

import { useRouter } from "expo-router";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

import { API_URL } from "../../constants/api";

const UserScreen = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [usuario, setUsuario] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cepInfo, setCepInfo] = useState(null);

  // Busca dados via CEP
  const loadCep = async (cepRaw) => {
    try {
      if (!cepRaw) return;

      const cep = cepRaw.replace(/\D/g, "");
      if (cep.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setCepInfo({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        });
      }
    } catch (e) {
      console.log("Erro ao buscar CEP:", e);
    }
  };

  // Carrega dados do usuário e dos chamados
  const loadUserData = async () => {
    if (!user) return;

    try {
      const clerkId = user.id;

      const userResponse = await fetch(`${API_URL}/usuarios/by-clerk/${clerkId}`);
      const userData = await userResponse.json();
      setUsuario(userData);

      if (userData?.cep) {
        loadCep(userData.cep);
      }

      const chamadasResponse = await fetch(
        `${API_URL}/chamadas/usuario/ByClerk/${clerkId}`
      );
      const chamadasData = await chamadasResponse.json();
      setChamados(chamadasData);

    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setLoading(false);
    }
  };

  // Logout simples
  const handleSignOut = () => {
    Alert.alert("Logout", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  };

  // EXCLUIR CONTA (versão corrigida)
  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Todos os seus chamados serão apagados permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },

        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const clerkId = user.id;

              // APAGA DIRETAMENTE PELO clerkId (correto)
              const res = await fetch(`${API_URL}/usuarios/${clerkId}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                Alert.alert("Erro", "Falha ao excluir sua conta no servidor.");
                return;
              }

              await signOut();

              Alert.alert(
                "Conta excluída",
                "Sua conta e todos os seus chamados foram removidos."
              );

              router.replace("../../(auth)/sign-In"); // rota válida

            } catch (e) {
              console.log(e);
              Alert.alert("Erro", "Erro ao excluir sua conta.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (isLoaded) loadUserData();
  }, [isLoaded]);

  const criarCard = (label, valor, icon) => (
    <View style={styles.editCard}>
      <View style={styles.editLeft}>
        <Ionicons name={icon} size={24} color="#888" />
        <View>
          <Text style={styles.editLabel}>{label}</Text>
          <Text style={styles.editValue}>{valor ?? "—"}</Text>
        </View>
      </View>
    </View>
  );

  if (loading || !usuario) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.cardChamados}>
          <Text style={styles.chamadosTitle}>Chamados</Text>
          <Text style={styles.chamadosCount}>{chamados.length}</Text>
        </View>

        {criarCard("Nome", usuario.nome, "person-outline")}
        {criarCard("Email", usuario.email, "mail-outline")}
        {criarCard("CEP", usuario.cep, "location-outline")}
        {criarCard("Número", usuario.numCasa, "home-outline")}
        {criarCard("Complemento", usuario.complemento, "home-outline")}

        {cepInfo && (
          <>
            {criarCard("Rua", cepInfo.logradouro, "navigate-outline")}
            {criarCard("Bairro", cepInfo.bairro, "business-outline")}
            {criarCard("Cidade", cepInfo.cidade, "map-outline")}
            {criarCard("Estado", cepInfo.estado, "flag-outline")}
          </>
        )}

        <TouchableOpacity style={styles.btnExcluir} onPress={handleDeleteAccount}>
          <Text style={styles.btnExcluirText}>Excluir Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnLogout} onPress={handleSignOut}>
          <Text style={styles.btnLogoutText}>Fazer Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default UserScreen;
