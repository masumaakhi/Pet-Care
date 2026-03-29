require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

console.log("Process ENV:", process.env.DATABASE_URL.substring(0, 30));

try {
  const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
    // Try providing custom options to bypass the initialization error
  });

  console.log("Prisma instantiated!");
  
  prisma.$connect().then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  }).catch((e) => {
    console.error("Connect error:", e);
    process.exit(1);
  });
} catch (e) {
  console.error("Instantiate error:", e);
  process.exit(1);
}
