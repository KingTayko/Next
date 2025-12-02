import { Text, View } from "react-native";
import AdminGuard from "../../../components/AdminGuard";

export default function AdminScreen() {
  return (
    <AdminGuard>
      <View>
        <Text>Tela de Perfil do Admin</Text>
      </View>
    </AdminGuard>
  );
}
