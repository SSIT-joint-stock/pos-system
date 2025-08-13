import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Kết nối Prisma với MongoDB
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma đã kết nối với MongoDB!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1); // Dừng app nếu không kết nối được
  }
};

export default prisma;
