import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    paddingHorizontal: 24,
    paddingBottom: 120, // espaço para o banner inferior
  },

  // Wrapper que ocupa toda a altura do ScrollView e centraliza o conteúdo
  centerContainer: {
    flex: 1,
    justifyContent: "center", // centraliza verticalmente
    alignItems: "center",     // centraliza horizontalmente
  },

  // Inner limita a largura dos inputs e mantém alinhamento à esquerda dentro do bloco central
  inner: {
    width: "100%",    // ocupa toda largura disponível (com padding do container)
    maxWidth: 420,    // opcional: limita em telas muito largas
  },

   logo: {
    fontSize: 45,
    fontWeight: "700",
    color: "#1A0D57",
    marginBottom: 10,
    textAlign: "left",
    top: -45,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
    textAlign: "left",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 28,
    textAlign: "left",
  },

  inputContainer: {
    marginBottom: 16,
  },

  textInput: {
    fontSize: 15,
    color: "#1A1A1A",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingRight: 12,
    marginBottom: 20,
    height: 52,
  },

  passwordInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    color: "#1A1A1A",
  },

  eyeButton: {
    padding: 8,
  },

  loginButton: {
    backgroundColor: "#1A0D57",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 10,
  },

  loginButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomBanner: {
    width: "117%",
    height: 90,
    backgroundColor: "#D6FF41",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 52,
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingTop: -110,

  },

  bottomText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    paddingBottom: 25,
  },
});
