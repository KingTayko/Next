import { StyleSheet } from "react-native";

export const AdminStyles = StyleSheet.create({
  // Estilo Geral
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA", // Fundo claro e suave
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  // Card de Contagem de Chamados (Igual ao do UserStyles)
  cardChamados: {
    backgroundColor: "#FFF",
    paddingVertical: 25,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2, // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  chamadosTitle: {
    fontSize: 20,
    color: "#333",
  },

  chamadosCount: {
    fontSize: 36, // Um pouco maior para destaque
    fontWeight: "bold",
    marginTop: 4,
    color: "#4A90E2", // Cor de destaque (Azul)
  },

  // Card de Informação do Administrador (Baseado em editCard, mas adaptado para 'infoCard')
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10, // Um pouco mais próximo
    flexDirection: "row",
    alignItems: "center",
    gap: 15, // Espaçamento entre ícone e texto
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    fontWeight: "500",
  },

  infoValue: {
    fontSize: 17,
    color: "#1A1A1A",
    fontWeight: "600",
  },

  // Lista de Chamados
  chamadoCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderLeftWidth: 5, // Destaque na lateral
    borderLeftColor: "#4A90E2",
  },

  chamadoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  chamadoStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  // Botão de Logout (Mantenho a cor do UserStyles, mas com estilo mais limpo)
  btnLogout: {
    backgroundColor: "#6E7B8F", // Cinza/Azulado
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 25, // Mais espaçamento
    alignItems: "center",
  },

  btnLogoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});