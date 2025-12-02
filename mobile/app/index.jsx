import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { API_URL } from "../constants/api";

export default function Index() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  const checkRole = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/by-clerk/${user.id}`);
      const userData = await res.json();

      if (userData.role === "ADMIN") {
        router.replace("/admin/(tabs)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("Erro ao buscar role:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      checkRole();
    }
  }, [isLoaded]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
