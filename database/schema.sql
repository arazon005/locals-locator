set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "tournaments" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "address" text NOT NULL,
  "days" text NOT NULL,
  "hours" text NOT NULL,
  "games" text,
  "notes" text,
  "lat" decimal NOT NULL,
  "lng" decimal NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);


CREATE TABLE "socialMedia" (
  "tournamentId" integer NOT NULL,
  "platform" text NOT NULL,
  "link" text NOT NULL
);

CREATE TABLE "users" (
  "username" text PRIMARY KEY NOT NULL,
  "hashedPassword" text NOT NULL
);

CREATE TABLE "editPerms" (
  "createdBy" text NOT NULL,
  "tournamentId" integer PRIMARY KEY NOT NULL
);

ALTER TABLE "socialMedia" ADD FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id");

ALTER TABLE "editPerms" ADD FOREIGN KEY ("tournamentId") REFERENCES "tournaments" ("id");

ALTER TABLE "editPerms" ADD FOREIGN KEY ("createdBy") REFERENCES "users" ("username");
