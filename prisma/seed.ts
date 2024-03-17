import { PrismaClient } from '@prisma/client';
import { Departments } from 'src/data/Facilities';

const prisma = new PrismaClient();

async function main() {
  for (const facility of Departments) {
    await prisma.facility.create({
      data: {
        roomNum: facility.roomNum,
        name: facility.name,
        description: facility.description,
        capacity: facility.capacity,
      },
    });
  }

  console.log('Facilities seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
