import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { API_URL } from "../constants/api";
import { ActivityIndicator, View, Text } from "react-native";

export default function AdminGuard({ children }) {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) loadRole();
  }, [isLoaded]);

  const loadRole = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/by-clerk/${user.id}`);
      const data = await res.json();
      setRole(data.role);
    } catch {
      setRole("USER");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (role !== "ADMIN") {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>Você não tem permissão para acessar esta área.</Text>
      </View>
    );
  }

  return children;
}
