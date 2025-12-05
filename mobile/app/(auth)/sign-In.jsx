import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { authStyles as s } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Preencha todos os campos");
      return;
    }

    if (!isLoaded) return;

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({ identifier: email, password });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        Alert.alert("Error", "Login falhou. Tente novamente.");
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Login falhou");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ScrollView com flexGrow pra ocupar a tela inteira */}
      <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={s.container}>
          {/* Center wrapper: centro real da tela */}
          <View style={s.centerContainer}>
            {/* inner controla largura dos inputs */}
            <View style={s.inner}>
              <Text style={s.logo}>NEXT</Text>

              <Text style={s.title}>Oi, de novo!</Text>
              <Text style={s.subtitle}>
                Caso você já tenha acessado nosso sistema, realize o login abaixo!
              </Text>

              {/* Email */}
              <View style={s.inputContainer}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  style={s.textInput}
                  autoCapitalize="none"
                />
              </View>

              {/* Senha */}
              <View style={s.passwordContainer}>
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={s.passwordInput}
                />

                <TouchableOpacity
                  style={s.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
                </TouchableOpacity>
              </View>

              {/* Botão */}
              <TouchableOpacity
                style={s.loginButton}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={s.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Banner inferior fixo */}
          <View style={s.bottomBanner}>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-Up")}>
              <Text style={s.bottomText}>Primeira vez? Cadastre-se aqui</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
