import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window"); // pegando altura da tela

export const SignUpstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.3, // desce 30% da tela
  },
  header: {
    width: "115%",
    paddingVertical: 20,
    backgroundColor: "#D1FF33",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E2E7E",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6C6C6C",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#1A1A1A",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 15,
  },
  inputPassword: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 13,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputHalf: {
    width: (width - 60) / 2, // 20 padding lateral + 20 gap
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#2E2E7E",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
