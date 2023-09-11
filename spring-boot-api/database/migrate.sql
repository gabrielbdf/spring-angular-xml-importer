SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

DROP TABLE IF EXISTS PUBLIC.registros;

CREATE TABLE public.registro (
	"data" timestamp(6) NULL,
	id int8 NOT NULL,
	codigo_agente varchar(255) NULL,
	hash_registro varchar(255) NULL,
	sigla_regiao varchar(255) NULL,
	compra _varchar NULL,
	geracao _varchar NULL,
	preco_medio _varchar NULL,
	CONSTRAINT registro_hash_registro_key UNIQUE (hash_registro),
	CONSTRAINT registro_pkey PRIMARY KEY (id)
)