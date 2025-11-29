import { StyleSheet } from "react-native";

export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },

  blueCard: {
    backgroundColor: "#0066FF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
  },

  welcomeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  subtitle: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },

  counter: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },

  newCallButton: {
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
  },

  newCallText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
