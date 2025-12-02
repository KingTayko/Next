import { StyleSheet, Dimensions } from "react-native";

// Obtém a largura da tela para possíveis ajustes responsivos (não está sendo usado, mas mantido)
// eslint-disable-next-line no-unused-vars
const { width } = Dimensions.get("window");

export const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F9", // Fundo cinza claro
    paddingHorizontal: 20,
    paddingTop: 50, // Espaço para o status bar e margem superior
  },
  
  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333", 
  },

  // CARD DE BOAS-VINDAS (blueCard)
  blueCard: {
    backgroundColor: "#2A7FFF", // Azul principal vibrante
    padding: 24,
    borderRadius: 20,
    minHeight: 180,
    justifyContent: "space-between",
    marginBottom: 25,
    // Sombra para destacar o card
    shadowColor: "#2A7FFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  counter: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 10,
    // Efeito de sombra sutil para o número grande
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // BOTÃO NOVO CHAMADO
  newCallButton: {
    backgroundColor: "#DFF977", // Verde/Amarelo vibrante
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20, // REDUZIDO: Para aproximar o botão do CallCard
    // Sombra para o botão
    shadowColor: "#DFF977",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  newCallText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  // LISTA (Container de CallCards)
  listContainer: {
    gap: 15,
    // Removendo a margem superior já que o botão tem margem inferior de 20
    paddingBottom: 150, // Espaço para a barra de navegação inferior (se houver)
  },

  // ===================================
  // CARD DE CHAMADO (CallCard) - NOVOS ESTILOS
  // ===================================
  card: {
    borderRadius: 15,
    overflow: 'hidden', // Importante para o LinearGradient
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
    gap: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    flexShrink: 1, // Permite que o texto quebre
  },
  cardInfo: {
    flexDirection: "column",
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
  },
  statusBox: {
    alignItems: "flex-end", // Alinha o status à direita
    marginTop: 5,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: 'uppercase',
  },

  searchInput: {
  backgroundColor: "#FFF",
  padding: 12,
  borderRadius: 10,
  marginVertical: 15,
  borderWidth: 1,
  borderColor: "#DDD",
  fontSize: 16,
},
});