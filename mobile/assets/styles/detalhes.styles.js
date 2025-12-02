import { StyleSheet } from "react-native";

export const DetalhesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
  },

  backButton: {
    marginTop: 10,
    marginBottom: 20,
    width: 40,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1A1A1A",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
  },

  value: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },

  extraInfo: {
    marginTop: 20,
  },

  extraText: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },

  cancelButton: {
    marginTop: 30,
    backgroundColor: "#D62828",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
