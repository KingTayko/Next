import { StyleSheet } from "react-native";

export const UserStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  cardChamados: {
    backgroundColor: "#FFF",
    paddingVertical: 25,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },

  chamadosTitle: {
    fontSize: 20,
    color: "#333",
  },

  chamadosCount: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 4,
    color: "#333",
  },

  row: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },

  rowLabel: {
    fontSize: 16,
    color: "#333",
  },

  rowAction: {
    fontSize: 15,
    color: "#3B3BFF",
    fontWeight: "500",
  },

  btnExcluir: {
    backgroundColor: "#D63232",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },

  btnExcluirText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  btnLogout: {
    backgroundColor: "#6E7B8F",
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },

  btnLogoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
