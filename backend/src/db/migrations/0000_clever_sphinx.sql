CREATE TABLE "chamada" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	"nome_usuario" text NOT NULL,
	"desc_chamada" text,
	"presencial" boolean DEFAULT true,
	"horario" time NOT NULL,
	"data" date NOT NULL,
	"cep_chamada" text,
	"data_criacao" timestamp DEFAULT now(),
	"status" text DEFAULT 'PENDENTE',
	"data_atualizacao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"role" text DEFAULT 'USER' NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"cep" text NOT NULL,
	"num_casa" integer NOT NULL,
	"complemento" text,
	"criado_em" timestamp DEFAULT now(),
	CONSTRAINT "usuario_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chamada" ADD CONSTRAINT "chamada_id_usuario_usuario_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id") ON DELETE cascade ON UPDATE no action;