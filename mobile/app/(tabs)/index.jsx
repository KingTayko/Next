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

import  {HomeStyles} from "../../assets/styles/home.styles";
import CallCard from "../../components/CallCard";
import { API_URL } from "../../constants/api";

export default function HomeScreen() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [chamadas, setChamadas] = useState([]);
  const [usuario, setUsuario] = useState(null); 
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsuarioEChamados = async () => {
    if (!user) return;

    try {
      const clerkId = user.id;

      // Buscar dados do usuário no banco
      const userResponse = await fetch(`${API_URL}/usuarios/by-clerk/${clerkId}`);
      if (!userResponse.ok) throw new Error("Erro ao buscar usuário");
      const userData = await userResponse.json();
      setUsuario(userData);

      // Buscar chamados do usuário pelo ClerkId
      const chamadasResponse = await fetch(
        `${API_URL}/chamadas/usuario/ByClerk/${clerkId}`
      );
      if (!chamadasResponse.ok) throw new Error("Erro ao buscar chamados");
      const chamadasData = await chamadasResponse.json();
      setChamadas(chamadasData);

    } catch (error) {
      console.log("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar suas informações.");
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
        <ActivityIndicator size="large" color="#000" />
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

        {/* CARD DE BOAS-VINDAS */}
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

        {/* LISTA */}
        <View style={{ gap: 20, paddingBottom: 120 }}>
          {chamadas.map((item) => (
            <CallCard key={item.id} chamada={item} />
          ))}
        </View>

      </ScrollView>
    </View>
  );
}