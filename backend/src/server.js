import express from "express";
import { ENV } from './config/env.js';

import { db } from "./config/db.js";

import { usuarioTable, chamadaTable } from "./db/schema.js";

import { eq, and} from 'drizzle-orm';
import { ilike } from "drizzle-orm/pg-core";

import job from "./config/cron.js";




const app = express();
const PORT = ENV.PORT || 5001;

if (ENV.NODE_ENV === "production") job.start();

app.use(express.json());




//endpoints
app.get("/api/health", (req, res) => {
  res.status(200).json({ sucess: false })
});




// ------------------- ROTAS USUÁRIO -------------------

// Criar usuário
app.post("/api/usuarios", async (req, res) => {
  try {
    const { clerkId, nome, cep, numCasa, complemento, email } = req.body;

    if (!nome || !cep || !numCasa) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const novoUsuario = await db
      .insert(usuarioTable)
      .values({
        clerkId,
        nome,
        cep,
        numCasa,
        complemento,
        email,
      })
      .returning();

    res.status(201).json(novoUsuario[0]);
  } catch (error) {
    console.log("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Atualizar usuário teste
app.put("/api/usuarios/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { nome, cep, numCasa, complemento, email, role } = req.body;

    const usuarioAtualizado = await db
      .update(usuarioTable)
      .set({
        nome,
        cep,
        numCasa,
        complemento,
        email,
        role,
        dataAtualizacao: new Date(),
      })
      .where(eq(usuarioTable.clerkId, clerkId))
      .returning();

    res.status(200).json(usuarioAtualizado[0]);
  } catch (error) {
    console.log("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});



// Excluir usuário + todos os chamados
app.delete("/api/usuario/delete/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Buscar usuário pelo clerkId
    const usuario = await db
      .select()
      .from(usuarioTable)
      .where(eq(usuarioTable.clerkId, clerkId))
      .limit(1);

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = usuario[0];

    // Deleta o usuário → graças ao cascade, os chamados também são deletados
    await db.delete(usuarioTable).where(eq(usuarioTable.id, user.id));

    return res.status(200).json({ message: "Conta excluída com sucesso" });

  } catch (error) {
    console.log("Erro ao excluir conta:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});





//teste
// Buscar usuário por clerkId
app.get("/api/usuarios/by-clerk/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({ error: "clerkId é obrigatório" });
    }

    const usuario = await db
      .select()
      .from(usuarioTable)
      .where(eq(usuarioTable.clerkId, clerkId))
      .limit(1);

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(usuario[0]);

  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


// ------------------- ROTAS CHAMADA -------------------









// Criar chamada
app.post("/api/chamadas", async (req, res) => {
  try {
    const { descChamada, presencial, horario, data, cepChamada, status, idUsuario, nomeUsuario } = req.body;

    if (!idUsuario || !horario || !data) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    // Verifica se o usuário existe
    const usuario = await db
      .select()
      .from(usuarioTable)
      .where(eq(usuarioTable.id, idUsuario));

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    //  **VERIFICAÇÃO DE CONFLITO AQUI**  
    const conflito = await db
      .select()
      .from(chamadaTable)
      .where(
        and(
          eq(chamadaTable.data, data),
          eq(chamadaTable.horario, horario)
        )
      );

    if (conflito.length > 0) {
      return res.status(409).json({ error: "Já existe um chamado nesse dia e horário" });
    }

    // 👉 Se não houver conflito, cria a chamada
    const novaChamada = await db
      .insert(chamadaTable)
      .values({
        idUsuario,
        nomeUsuario,
        descChamada,
        presencial,
        horario,
        data,
        cepChamada,
        status: status || "EM ANDAMENTO",
      })
      .returning();

    res.status(201).json(novaChamada[0]);
  } catch (error) {
    console.log("Erro ao criar chamada:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});















// Buscar chamadas de um usuário específico pelo NOME
app.get("/api/chamadas/usuario/nome/:nomeUsuario", async (req, res) => {
  try {
    const { nomeUsuario } = req.params;

    if (!nomeUsuario) {
      return res.status(400).json({ error: "Nome do usuário é obrigatório" });
    }

    const chamadas = await db
      .select({
        id: chamadaTable.id,
        descChamada: chamadaTable.descChamada,
        presencial: chamadaTable.presencial,
        horario: chamadaTable.horario,
        data: chamadaTable.data,
        cepChamada: chamadaTable.cepChamada,
        dataCriacao: chamadaTable.dataCriacao,
        status: chamadaTable.status,
        dataAtualizacao: chamadaTable.dataAtualizacao,
        nomeUsuario: usuarioTable.nome,
      })
      .from(chamadaTable)
      .leftJoin(usuarioTable, eq(chamadaTable.idUsuario, usuarioTable.id))
      .where(eq(usuarioTable.nome, nomeUsuario));

    res.status(200).json(chamadas);
  } catch (error) {
    console.log("Erro ao buscar chamadas:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Buscar chamada do usuário por ID do banco
app.get("/api/chamadas/usuario/id/:idUsuario", async (req, res) => {
  try {
    const { idUsuario } = req.params;

    if (!idUsuario) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const chamadas = await db
      .select({
        id: chamadaTable.id,
        descChamada: chamadaTable.descChamada,
        presencial: chamadaTable.presencial,
        horario: chamadaTable.horario,
        data: chamadaTable.data,
        cepChamada: chamadaTable.cepChamada,
        dataCriacao: chamadaTable.dataCriacao,
        status: chamadaTable.status,
        dataAtualizacao: chamadaTable.dataAtualizacao,
        nomeUsuario: usuarioTable.nome,
      })
      .from(chamadaTable)
      .leftJoin(usuarioTable, eq(chamadaTable.idUsuario, usuarioTable.id))
      .where(eq(usuarioTable.id, Number(idUsuario)));

    res.status(200).json(chamadas);
  } catch (error) {
    console.log("Erro ao buscar chamadas por ID:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

//busca e mostra chamadas do usuario por clerkId
app.get("/api/chamadas/usuario/ByClerk/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }


    const chamadas = await db
      .select({
        id: chamadaTable.id,
        descChamada: chamadaTable.descChamada,
        presencial: chamadaTable.presencial,
        horario: chamadaTable.horario,
        data: chamadaTable.data,
        cepChamada: chamadaTable.cepChamada,
        dataCriacao: chamadaTable.dataCriacao,
        status: chamadaTable.status,
        dataAtualizacao: chamadaTable.dataAtualizacao,
        nomeUsuario: usuarioTable.nome,
      })
      .from(chamadaTable)
      .leftJoin(usuarioTable, eq(chamadaTable.idUsuario, usuarioTable.id))
      .where(eq(usuarioTable.clerkId, clerkId));

    res.status(200).json(chamadas);
  } catch (error) {
    console.log("Erro ao buscar chamadas por ID:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Atualizar Status por id da Chamada
app.put("/api/chamadas/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const chamadaCancelada = await db
      .update(chamadaTable)
      .set({ status: status || "Cancelada", dataAtualizacao: new Date() })
      .where(eq(chamadaTable.id, Number(id)))
      .returning();

    res.status(200).json(chamadaCancelada[0]);
  } catch (error) {
    console.log("Erro ao cancelar chamada:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});


//teste
// Atualizar dados do usuário + refletir CEP nos chamados
app.put("/api/usuario/update/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { nome, cep } = req.body;

    // Buscar usuário pelo clerkId
    const usuario = await db
      .select()
      .from(usuarioTable)
      .where(eq(usuarioTable.clerkId, clerkId))
      .limit(1);

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = usuario[0];

    // Atualizar usuário
    const usuarioAtualizado = await db
      .update(usuarioTable)
      .set({
        nome,
        cep,
        dataAtualizacao: new Date(),
      })
      .where(eq(usuarioTable.id, user.id))
      .returning();

    // Atualizar chamados do usuário (somente o CEP)
    const chamadosAtualizados = await db
      .update(chamadaTable)
      .set({
        cep_chamada: cep,        // <<--- aqui corrigido
        dataAtualizacao: new Date(),
      })
      .where(eq(chamadaTable.idUsuario, user.id))
      .returning();

    res.status(200).json({
      message: "Usuário e chamados atualizados com sucesso",
      usuario: usuarioAtualizado[0],
      totalChamadosAtualizados: chamadosAtualizados.length,
      chamados: chamadosAtualizados,
    });

  } catch (error) {
    console.log("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


//teste
// Buscar chamada específica por ID
app.get("/api/chamadas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const chamada = await db
      .select()
      .from(chamadaTable)
      .where(eq(chamadaTable.id, Number(id)))
      .limit(1);

    if (chamada.length === 0) {
      return res.status(404).json({ error: "Chamada não encontrada" });
    }

    res.status(200).json(chamada[0]);
  } catch (error) {
    console.log("Erro ao buscar chamada:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});



//mostrar todos os chamados de todos os usuarios admin
app.get("/api/chamadas", async (req, res) => {
  try {
    const chamadas = await db
      .select({
        id: chamadaTable.id,
        descChamada: chamadaTable.descChamada,
        presencial: chamadaTable.presencial,
        horario: chamadaTable.horario,
        data: chamadaTable.data,
        cepChamada: chamadaTable.cepChamada,
        dataCriacao: chamadaTable.dataCriacao,
        status: chamadaTable.status,
        dataAtualizacao: chamadaTable.dataAtualizacao,
        nomeUsuario: usuarioTable.nome,
      })
      .from(chamadaTable)
      .leftJoin(usuarioTable, eq(chamadaTable.idUsuario, usuarioTable.id));

    res.status(200).json(chamadas);

  } catch (error) {
    console.log("Erro ao buscar todas as chamadas:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

//verificar se ja existe data e horario salvo
app.get("/api/chamadas/check", async (req, res) => {
  try {
    const { data, horario } = req.query;

    if (!data || !horario) {
      return res.status(400).json({ error: "Data e horário são obrigatórios" });
    }

    const chamadas = await db
      .select()
      .from(chamadaTable)
      .where(
        and(
          eq(chamadaTable.data, data),
          eq(chamadaTable.horario, horario)
        )
      );

    return res.json({ exists: chamadas.length > 0 });
  } catch (error) {
    console.log("Erro ao verificar chamada:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


//pesquisar chamadas por descrição, nome do usuário ou ID do usuário
app.get("/api/chamadas/search", async (req, res) => {
  try {
    const { descricao, nome, idUsuario } = req.query;

    let filtros = [];

    // Buscar por descrição
    if (descricao) {
      filtros.push(ilike(chamadaTable.descChamada, `%${descricao}%`));
    }

    // Buscar por nome do usuário
    if (nome) {
      filtros.push(ilike(usuarioTable.nome, `%${nome}%`));
    }

    // Buscar por ID do usuário
    if (idUsuario) {
      filtros.push(eq(chamadaTable.idUsuario, Number(idUsuario)));
    }

    // Nenhum filtro enviado
    if (filtros.length === 0) {
      return res.status(400).json({ error: "Nenhum filtro enviado." });
    }

    const whereClause = filtros.length > 1 ? and(...filtros) : filtros[0];

    const chamadas = await db
      .select({
        id: chamadaTable.id,
        descChamada: chamadaTable.descChamada,
        presencial: chamadaTable.presencial,
        horario: chamadaTable.horario,
        data: chamadaTable.data,
        cepChamada: chamadaTable.cepChamada,
        dataCriacao: chamadaTable.dataCriacao,
        status: chamadaTable.status,
        dataAtualizacao: chamadaTable.dataAtualizacao,
        nomeUsuario: usuarioTable.nome,
      })
      .from(chamadaTable)
      .leftJoin(usuarioTable, eq(chamadaTable.idUsuario, usuarioTable.id))
      .where(whereClause);

    res.status(200).json(chamadas);
  } catch (error) {
    console.log("Erro ao buscar chamadas:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


app.listen(PORT, () => {
  console.log('Server is running on port: ', PORT);
});