-- CreateEnum
CREATE TYPE "ingredients_difficulty_enum" AS ENUM ('easy', 'medium', 'hard');

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "login_until" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "steps" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER,
    "difficulty" "ingredients_difficulty_enum",

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients__recipes" (
    "amount" DECIMAL NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "ingredients__recipes_pkey" PRIMARY KEY ("recipeId","ingredientId")
);

-- CreateTable
CREATE TABLE "people__ingredients" (
    "ingredientId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "people__ingredients_pkey" PRIMARY KEY ("personId","ingredientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_userId_key" ON "people"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "ingredients__recipes_ingredientId_idx" ON "ingredients__recipes"("ingredientId");

-- CreateIndex
CREATE INDEX "ingredients__recipes_recipeId_idx" ON "ingredients__recipes"("recipeId");

-- CreateIndex
CREATE INDEX "people__ingredients_ingredientId_idx" ON "people__ingredients"("ingredientId");

-- CreateIndex
CREATE INDEX "people__ingredients_personId_idx" ON "people__ingredients"("personId");

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredients__recipes" ADD CONSTRAINT "ingredients__recipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredients__recipes" ADD CONSTRAINT "ingredients__recipes_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people__ingredients" ADD CONSTRAINT "people__ingredients_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people__ingredients" ADD CONSTRAINT "people__ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
