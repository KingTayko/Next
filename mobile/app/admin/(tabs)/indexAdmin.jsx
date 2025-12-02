import AdminGuard from "../../../components/AdminGuard";

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

      // Buscar dados do usuário
      const userRes = await fetch(`${API_URL}/usuarios/by-clerk/${clerkId}`);
      const userData = await userRes.json();
      setUsuario(userData);

      // Buscar todas as chamadas (admin vê tudo!)
      const chamadasRes = await fetch(`${API_URL}/chamadas`);
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
    if (isLoaded && user) {
      loadUsuarioEChamados();
    }
  }, [isLoaded]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsuarioEChamados();
  };

  if (loading) {
    return (
      <AdminGuard>
        <View style={[HomeStyles.container, { justifyContent: "center", alignItems: "center" }]}>
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
          <View style={HomeStyles.header}>
            <Text style={HomeStyles.logoText}>ADMIN NEXT</Text>
            <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
          </View>

          <View style={HomeStyles.blueCard}>
            <Text style={HomeStyles.welcomeText}>
              Bem-vindo, Administrador
            </Text>
            <Text style={HomeStyles.subtitle}>Chamados Totais</Text>
            <Text style={HomeStyles.counter}>{chamadas.length}</Text>
          </View>

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
