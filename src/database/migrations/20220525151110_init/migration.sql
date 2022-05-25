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
    "user_id" INTEGER,

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
    "name" TEXT NOT NULL,
    "steps" TEXT NOT NULL,
    "image" TEXT,
    "decoration" TEXT,
    "alcohol_content" DECIMAL(65,30),
    "original_url" TEXT,
    "hardness" INTEGER,
    "sweetness" INTEGER,
    "calories" INTEGER,
    "serve_in" TEXT,
    "description" TEXT,

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
    "amount" JSONB NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "ingredients__recipes_pkey" PRIMARY KEY ("recipe_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "people__ingredients" (
    "ingredient_id" INTEGER NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "people__ingredients_pkey" PRIMARY KEY ("person_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "glassware" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "capacity" TEXT,

    CONSTRAINT "glassware_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_user_id_key" ON "people"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_name_key" ON "recipes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE INDEX "ingredients__recipes_ingredient_id_idx" ON "ingredients__recipes"("ingredient_id");

-- CreateIndex
CREATE INDEX "ingredients__recipes_recipe_id_idx" ON "ingredients__recipes"("recipe_id");

-- CreateIndex
CREATE INDEX "people__ingredients_ingredient_id_idx" ON "people__ingredients"("ingredient_id");

-- CreateIndex
CREATE INDEX "people__ingredients_person_id_idx" ON "people__ingredients"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "glassware_name_key" ON "glassware"("name");

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredients__recipes" ADD CONSTRAINT "ingredients__recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ingredients__recipes" ADD CONSTRAINT "ingredients__recipes_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people__ingredients" ADD CONSTRAINT "people__ingredients_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "people__ingredients" ADD CONSTRAINT "people__ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
