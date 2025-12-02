import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { SignUpstyles as styles } from "../../assets/styles/signUp.styles";
import { Ionicons } from "@expo/vector-icons";

import { API_URL } from "../../constants/api";




const SignUpScreen = () => {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    //bd
    const [name, setName] = useState("");
    const [cep, setCep] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");


    const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error", "Preencha todos os campos");
    if (!isLoaded) return;

    setLoading(true);

    try {
        // 1. Cria o usuário no Clerk
        const result = await signUp.create({
            emailAddress: email,
            password,
        });

        const clerkId = result.createdUserId;

        // 2. ***Ativa a sessão imediatamente***
        await setActive({ session: result.createdSessionId });

        // 3. Cria usuário no seu backend
        const response = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: name,
                clerkId,
                cep,
                numCasa: numero,
                complemento,
                email
            }),
        });

        const data = await response.json();
        console.log(data.id, data.nome);

        Alert.alert(
            "Success",
            "Usuário cadastrado com sucesso!",
            [
                {
                    text: "OK",
                    onPress: () => router.replace("/(tabs)"),
                }
            ]
        );

    } catch (err) {
        console.error(err);
        Alert.alert("Error", err.errors?.[0]?.message || "Failed to create account");
    } finally {
        setLoading(false);
    }
};


    {/*formatar cep */ }
    const formatCEP = (text) => {
        // Remove tudo que não for número
        let digits = text.replace(/\D/g, '');
        // Limita a 8 dígitos
        digits = digits.substring(0, 8);
        // Formata como 00000-000
        if (digits.length > 5) {
            return digits.substring(0, 5) + '-' + digits.substring(5);
        }
        return digits;
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>CADASTRO</Text>
                </View>



                <Text style={styles.title}>Seja bem vindo!</Text>
                <Text style={styles.subtitle}>
                    Preencha todos os campos abaixo e garanta o acesso a todos serviços pelo seu celular!
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor={"#9CA3AF"}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={"#9CA3AF"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Senha"
                        placeholderTextColor={"#9CA3AF"}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#9CA3AF"
                        />

                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="CEP"
                        placeholderTextColor={"#9CA3AF"}
                        value={cep}
                        keyboardType="numeric"
                        onChangeText={(text) => setCep(formatCEP(text))}
                        maxLength={9} // 8 dígitos + hífen
                    />
                    <TextInput
                        style={[styles.input, styles.inputHalf]}
                        placeholder="N°"
                        placeholderTextColor={"#9CA3AF"}
                        value={numero}
                        keyboardType="numeric"
                        onChangeText={setNumero}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Complemento"
                    placeholderTextColor={"#9CA3AF"}
                    value={complemento}
                    onChangeText={setComplemento}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                    disabled={loading}

                >


                    <Text style={styles.buttonText}>
                        {loading ? "Carregando..." : "Cadastrar"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;