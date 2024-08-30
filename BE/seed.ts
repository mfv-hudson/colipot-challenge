import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed Departments
  const departments = [];
  for (let i = 0; i < 5; i++) {
    const department = await prisma.department.create({
      data: {
        name: faker.company.name(),
      },
    });
    departments.push(department);
  }

  // Seed Seats
  for (let i = 0; i < 50; i++) {
    await prisma.seat.create({
      data: {
        seatNo: faker.string.alphanumeric(5),
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
