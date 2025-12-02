import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  date,
  time,
} from "drizzle-orm/pg-core";

// TABELA USUÁRIO
export const usuarioTable = pgTable("usuario", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  role: text("role").notNull().default("USER"),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  cep: text("cep").notNull(),
  numCasa: integer("num_casa").notNull(),
  complemento: text("complemento"),
  criadoEm: timestamp("criado_em").defaultNow(),
});

// TABELA CHAMADA (COM RELACIONAMENTO)
export const chamadaTable = pgTable("chamada", {
  id: serial("id").primaryKey(),

  
  idUsuario: integer("id_usuario")
    .notNull()
    .references(() => usuarioTable.id, { onDelete: "cascade" }),

  nomeUsuario: text("nome_usuario").notNull(),

  descChamada: text("desc_chamada"),

  presencial: boolean("presencial").default(true),

  horario: time("horario").notNull(),

  data: date("data").notNull(),

  cepChamada: text("cep_chamada"),

  dataCriacao: timestamp("data_criacao").defaultNow(),

  status: text("status").default("PENDENTE"),

  // atualizado manualmente pelo admin
  dataAtualizacao: timestamp("data_atualizacao").notNull().defaultNow(),
});
