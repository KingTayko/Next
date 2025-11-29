import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import { HomeStyles } from "../../assets/styles/home.styles";
import CallCard from "../../components/CallCard";
import { API_URL } from "../../constants/api";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [chamadas, setChamadas] = useState([]);
  const [usuario, setUsuario] = useState(null); // Dados do usuário do banco
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Função para carregar usuário e chamadas do banco
  const loadUsuarioEChamados = async () => {
    if (!user) return;

    try {
      // Buscar dados do usuário no backend pelo clerkId
      const userResponse = await fetch(`${API_URL}/usuarios/clerk/${user.id}`);
      if (!userResponse.ok) throw new Error("Erro ao buscar usuário");

      const userData = await userResponse.json();
      setUsuario(userData); // salva os dados do usuário

      // Buscar chamados do usuário
      const chamadasResponse = await fetch(`http://192.168.0.100:5001/chamadas/usuario/id/${userData.id}`);
      if (!chamadasResponse.ok) throw new Error("Erro ao buscar chamados");

      const chamadasData = await chamadasResponse.json();
      setChamadas(chamadasData);
    } catch (error) {
      console.log("Erro ao carregar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoaded) loadUsuarioEChamados();
  }, [isLoaded, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsuarioEChamados();
  };

  if (loading) {
    return (
      <View style={[HomeStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={HomeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={HomeStyles.header}>
          <Text style={HomeStyles.logoText}>NEXT</Text>
          <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
        </View>

        {/* CARD AZUL */}
        <View style={HomeStyles.blueCard}>
          <Text style={HomeStyles.welcomeText}>
            Bem-vindo de volta{usuario?.nome ? `, ${usuario.nome}` : ""}
          </Text>
          <Text style={HomeStyles.subtitle}>Chamados Realizados</Text>
          <Text style={HomeStyles.counter}>{chamadas?.length ?? 0}</Text>
        </View>

        {/* BOTÃO NOVO CHAMADO */}
        <TouchableOpacity
          style={HomeStyles.newCallButton}
          onPress={() => router.push("../Screen/newCall")}
        >
          <Text style={HomeStyles.newCallText}>Novo Chamado</Text>
        </TouchableOpacity>

        {/* LISTA DE CHAMADOS */}
        <View style={{ gap: 20, paddingBottom: 120 }}>
          {chamadas.map((item) => (
            <CallCard key={item.id} chamada={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
