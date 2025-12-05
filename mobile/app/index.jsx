import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { API_URL } from "../constants/api";

export default function Index() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Espera Clerk carregar
    if (!isLoaded) return;

    // Ainda carregando o usuário
    if (user === undefined) return;

    // Não logado → login
    if (user === null) {
      router.replace("/(auth)/sign-In");
      return;
    }

    // Logado → buscar role
    async function checkRole() {
      try {
        const res = await fetch(`${API_URL}/usuarios/by-clerk/${user.id}`);
        const data = await res.json();

        if (data.role === "ADMIN") {
          router.replace("/admin"); // ← caminho correto
        } else {
          router.replace("/(tabs)");
        }
      } catch (err) {
        console.log("Erro ao verificar role:", err);
      }
    }

    checkRole();
  }, [isLoaded, user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
