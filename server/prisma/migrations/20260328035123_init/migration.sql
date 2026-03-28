-- Recreated migration to match current Prisma schema
-- Generates the "User" table with the fields defined in schema.prisma

-- Enable pgcrypto for gen_random_uuid (safe no-op if already installed)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "display_name" VARCHAR(60) NOT NULL,
    "bio" TEXT,
    "avatar_url" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");
