import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

import AdminGuard from "../../../components/AdminGuard";
import { HomeStyles } from "../../../assets/styles/home.styles";
import CallCard from "../../../components/CallCard";
import { API_URL } from "../../../constants/api";

export default function IndexAdmin() {
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

      // Buscar usuário no backend
      const userRes = await fetch(`${API_URL}/usuarios/by-clerk/${clerkId}`);
      if (!userRes.ok) throw new Error("Erro ao buscar usuário");
      const userData = await userRes.json();
      setUsuario(userData);

      // Verificar se é admin
      if (userData?.role !== "ADMIN") {
        Alert.alert("Acesso negado", "Você não tem permissão de administrador.");
        router.replace("/home");
        return;
      }

      // Buscar TODAS as chamadas — igual ao ViaCEP do HomeScreen
      const chamadasRes = await fetch(`${API_URL}/chamadas`);
      if (!chamadasRes.ok) throw new Error("Erro ao buscar chamadas");
      const chamadasData = await chamadasRes.json();

      setChamadas(chamadasData);
    } catch (error) {
      console.log("Erro:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
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
      <AdminGuard>
        <View
          style={[
            HomeStyles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <View style={HomeStyles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* HEADER */}
          <View style={HomeStyles.header}>
            <Text style={HomeStyles.logoText}>ADMIN NEXT</Text>
            <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
          </View>

          {/* INFO CARD */}
          <View style={HomeStyles.blueCard}>
            <Text style={HomeStyles.welcomeText}>
              Painel Administrativo
            </Text>
            <Text style={HomeStyles.subtitle}>Chamados Totais</Text>
            <Text style={HomeStyles.counter}>{chamadas?.length ?? 0}</Text>
          </View>

          {/* LISTA */}
          <View style={{ gap: 20, paddingBottom: 120 }}>
            {chamadas.map((item) => (
              <CallCard key={item.id} chamada={item} />
            ))}
          </View>
        </ScrollView>
      </View>
    </AdminGuard>
  );
}
