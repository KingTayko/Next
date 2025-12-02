import { useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { API_URL } from "../constants/api";

export default function Index() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function redirect() {
      if (!isLoaded) return;

      // usuário não logado → manda para login
      if (!user) {
        router.replace("/(auth)/sign-In");
        return;
      }

      // usuário logado → buscar role
      try {
        const res = await fetch(`${API_URL}/usuarios/by-clerk/${user.id}`);
        const data = await res.json();

        if (data.role === "ADMIN") {
          router.replace("/admin/(tabs)");
        } else {
          router.replace("/(tabs)");
        }
      } catch (err) {
        console.log("Erro ao verificar role:", err);
      }
    }

    redirect();
  }, [isLoaded, user]);

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
