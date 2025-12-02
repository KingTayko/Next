import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },

  // CARD
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    borderColor: "#DDD",
    borderWidth: 1,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },
  value: {
    fontWeight: "400",
  },

  // DATAS
  dateBox: {
    marginTop: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },

  // BOTÃO CANCELAR
  cancelButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
