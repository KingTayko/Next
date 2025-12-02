import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { HomeStyles } from "../assets/styles/home.styles";
import { useRouter } from "expo-router";

export default function CallCard({ chamada }) {
  const router = useRouter();

  const statusColor = {
    "EM ANDAMENTO": "#F4A100",
    CANCELADO: "#D9534F",
    FINALIZADA: "#3CBC8D",
  };

  const handlePress = () => {
    router.push(`/Screen/detalhes?id=${chamada.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        style={HomeStyles.card}
      >
        <LinearGradient
          colors={["#f8f9ff", "#ffffff"]}
          style={HomeStyles.cardGradient}
        >
          {/* TÍTULO DO CHAMADO */}
          <View style={HomeStyles.cardHeader}>
            <Ionicons name="construct-outline" size={24} color="#1A1A1A" />
            <Text style={HomeStyles.cardTitle}>
              {chamada.descChamada || "Sem descrição"}
            </Text>
          </View>

          {/* INFO */}
          <View style={HomeStyles.cardInfo}>
            <View style={HomeStyles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#444" />
              <Text style={HomeStyles.infoText}>{chamada.data}</Text>
            </View>

            <View style={HomeStyles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#444" />
              <Text style={HomeStyles.infoText}>{chamada.horario}</Text>
            </View>

            <View style={HomeStyles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#444" />
              <Text style={HomeStyles.infoText}>
                {chamada.cepChamada || "Sem CEP"}
              </Text>
            </View>
          </View>

          {/* STATUS */}
          <View style={HomeStyles.statusBox}>
            <View
              style={[
                HomeStyles.statusTag,
                { backgroundColor: statusColor[chamada.status] || "#999" },
              ]}
            >
              <Text style={HomeStyles.statusText}>{chamada.status}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}
