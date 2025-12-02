import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../constants/api";
import { DetalhesStyles as styles } from "../../assets/styles/detalhes.styles";
import { useUser } from "@clerk/clerk-expo"; // ⬅ IMPORTANTE

export default function DetalhesChamadaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser(); // ⬅ PEGA O USUÁRIO LOGADO (Clerk)

  const [chamada, setChamada] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [endereco, setEndereco] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChamada();
  }, [id, user]);

  const loadChamada = async () => {
    try {
      // Buscar chamada
      const response = await fetch(`${API_URL}/chamadas/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar chamada");

      const data = await response.json();
      setChamada(data);

      // Buscar usuário logado pelo clerkId
      if (user?.id) {
        const userRes = await fetch(`${API_URL}/usuarios/by-clerk/${user.id}`);
        const userData = await userRes.json();
        setUsuario(userData);
      }

      // Buscar dados do endereço via CEP
      if (data.cepChamada) {
        const cleanCep = data.cepChamada.replace(/\D/g, "");
        const viaCepRes = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        const viaCepData = await viaCepRes.json();
        setEndereco(viaCepData);
      }

    } catch (error) {
      console.log("Erro:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da chamada.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (chamada.status === "CANCELADO" || chamada.status === "CANCELADA") {
      Alert.alert(
        "Chamado já cancelado",
        "Este chamado já foi cancelado anteriormente."
      );
      return;
    }

    Alert.alert(
      "Cancelar Chamado",
      "Tem certeza que deseja cancelar este chamado?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/chamadas/status/${id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: "CANCELADO" }),
                }
              );

              if (!response.ok) throw new Error("Erro ao cancelar");

              Alert.alert("Sucesso", "Chamado cancelado.");
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível cancelar.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!chamada) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Chamado não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");
  const formatTime = (time) => time?.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#222" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Detalhes do Chamado</Text>

          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{chamada.descChamada}</Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{chamada.status}</Text>

          {/* Endereço completo */}
          <Text style={styles.label}>Endereço:</Text>

          {endereco ? (
            <Text style={styles.value}>
              {endereco.logradouro}, {usuario?.numCasa}{"\n"}
              {endereco.bairro}{"\n"}
              {endereco.localidade} - {endereco.uf}{"\n"}
              CEP: {chamada.cepChamada}{"\n"}
              Complemento: {usuario?.complemento || "Nenhum"}
            </Text>
          ) : (
            <Text style={styles.value}>Carregando endereço...</Text>
          )}

          <Text style={styles.label}>Data:</Text>
          <Text style={styles.value}>{formatDate(chamada.data)}</Text>

          <Text style={styles.label}>Horário:</Text>
          <Text style={styles.value}>{formatTime(chamada.horario)}</Text>
        </View>

        <View style={styles.extraInfo}>
          <Text style={styles.extraText}>
            Criado em: {formatDate(chamada.dataCriacao)}
          </Text>
          <Text style={styles.extraText}>
            Última atualização: {formatDate(chamada.dataAtualizacao)}
          </Text>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
          <Text style={styles.cancelText}>CANCELAR CHAMADO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
