DROP TABLE IF EXISTS person;

DROP TABLE IF EXISTS dept;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS dept (
  --id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS person (
  --id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  id SERIAL NOT NULL PRIMARY KEY,
  last_name       TEXT        NOT NULL,
  first_name      TEXT        NOT NULL,
  address         TEXT        NULL,
  age             INT2        NULL,
  dept_id         INT        NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES dept (id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

