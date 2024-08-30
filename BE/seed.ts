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

  // Seed Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        departmentId: departments[Math.floor(Math.random() * departments.length)].id,
        role: 'EMPLOYEE',
      },
    });
    users.push(user);
  }

  // Seed Seats
  const seats = [];
  for (let i = 0; i < 50; i++) {
    const seat = await prisma.seat.create({
      data: {
        seatNo: faker.string.alphanumeric(5),
      },
    });
    seats.push(seat);
  }

  // Seed UserBookings with different dates
  for (let i = 0; i < 20; i++) {
    await prisma.userBooking.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        seatId: seats[Math.floor(Math.random() * seats.length)].id,
        bookingDate: faker.date.future(),
      },
    });
  }

  // Seed Checkins with different dates
  for (let i = 0; i < 20; i++) {
    await prisma.checkin.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        seatId: seats[Math.floor(Math.random() * seats.length)].id,
        time: faker.date.recent(),
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
