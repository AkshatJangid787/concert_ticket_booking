import "dotenv/config";
import { PrismaClient } from "../src/generated/client/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("SEED RUNNING");

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password!, 12);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: email!,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
