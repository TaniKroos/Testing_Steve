import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { seedPackages } from "../src/data/seedPackages.js";

const prisma = new PrismaClient();

async function main() {
  for (const item of seedPackages) {
    await prisma.package.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        highlights: JSON.stringify(item.highlights),
        inclusions: JSON.stringify(item.inclusions),
        itinerary: JSON.stringify(item.itinerary),
        departures: JSON.stringify(item.departures),
      },
    });
  }

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "change-me-before-production";
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: await bcrypt.hash(password, 12), role: "admin" },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
