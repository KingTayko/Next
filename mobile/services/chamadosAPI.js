const BASE_URL = "https://next-kogb.onrender.com/api";
{/** */}


export const ChamadosAPI = {
  getChamadosByUsuario: async () => {
    try {
      const response = await fetch(`${BASE_URL}/chamadas/usuario/ByClerk/${user.id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      return [];
    }
  },
};
