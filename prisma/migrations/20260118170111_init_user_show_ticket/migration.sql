/*
  Warnings:

  - You are about to drop the column `email` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;
