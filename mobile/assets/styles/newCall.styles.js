import { StyleSheet, Dimensions, Platform } from 'react-native';

const primaryColor = '#000982ff'; // Um roxo escuro (cor principal da marca)

const newCallStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  
  // --- Header/Navegação (Separado para layout fixo) ---
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1, // Linha de separação, se necessário
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 10, // Área de clique
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: primaryColor,
    marginLeft: 5,
  },
  
  // --- Conteúdo Rolável ---
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  // --- Título do Passo ---
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  
  // --- Área de Texto para Descrição ---
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  
  // --- Checkboxes (Customizado) ---
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkedBox: {
    backgroundColor: primaryColor,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  
  // --- Cards de Data e Horário ---
  dateTimeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    // Sombra para dar o efeito de card
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dateTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#888',
    marginLeft: 10,
  },
  dateTimeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    marginTop: 2,
  },
  alterarButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // --- Botão Finalizar Chamado (Fixo) ---
  finishButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    // Adiciona uma linha sutil acima do botão se o fundo for branco
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0', 
  },
  finishButton: {
    backgroundColor: primaryColor,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default newCallStyles;