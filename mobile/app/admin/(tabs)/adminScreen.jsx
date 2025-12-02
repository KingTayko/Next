import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { AdminStyles as styles } from "../../../assets/styles/admin.styles";

import { useRouter } from "expo-router";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { useState, useEffect } from "react";

import { API_URL } from "../../../constants/api";

const adminScreen = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [usuario, setUsuario] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    if (!user) return;

    try {
      const clerkId = user.id;

      const userResponse = await fetch(`${API_URL}/usuarios/by-clerk/${clerkId}`);
      const userData = await userResponse.json();
      setUsuario(userData);

      const chamadasResponse = await fetch(`${API_URL}/chamadas`);
      const chamadasData = await chamadasResponse.json();
      setChamados(chamadasData);

    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar dados de administrador.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) loadAdminData();
  }, [isLoaded]);

  const criarInfoCard = (label, valor, icon) => (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={26} color="#777" />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{valor ?? "—"}</Text>
      </View>
    </View>
  );

  const handleSignOut = () => {
    Alert.alert("Sair", "Deseja realmente fazer logout?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

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

        {/* Total de Chamados */}
        <View style={styles.cardChamados}>
          <Text style={styles.chamadosTitle}>Chamados Registrados</Text>
          <Text style={styles.chamadosCount}>{chamados.length}</Text>
        </View>

        {/* Infos do admin */}
        {criarInfoCard("Nome", usuario.nome, "person-outline")}
        {criarInfoCard("Email", usuario.email, "mail-outline")}
        {criarInfoCard("Função", "Administrador", "shield-checkmark-outline")}

        <View style={{ marginTop: 25 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
            Lista de Chamados
          </Text>

          {chamados.map((c) => (
            <View key={c.id} style={styles.chamadoCard}>
              <Ionicons name="document-text-outline" size={26} color="#444" />
              <View>
                <Text style={styles.chamadoTitle}>{c.descChamada}</Text>
                <Text style={styles.chamadoStatus}>Status: {c.status}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btnLogout} onPress={handleSignOut}>
          <Text style={styles.btnLogoutText}>Fazer Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default adminScreen;
