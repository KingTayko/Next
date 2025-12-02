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

  /* -------------------------------------- */
  /*  ESTILO DO CARD IGUAL AO DE HORÁRIO   */
  /* -------------------------------------- */
  editCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },

  editLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  editLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  editValue: {
    fontSize: 17,
    color: "#1A1A1A",
    fontWeight: "500",
  },

  editValueInput: {
    fontSize: 17,
    color: "#1A1A1A",
    fontWeight: "500",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: "#CCC",
    minWidth: 120,
  },

  alterarButtonText: {
    color: "#3B3BFF",
    fontSize: 15,
    fontWeight: "600",
  },

  /* BOTÕES */
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
