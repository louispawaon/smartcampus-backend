import { PrismaClient } from '@prisma/client';
import { Facilities } from '../src/data/Facilities';

const prisma = new PrismaClient();

async function main() {
  for (const facility of Facilities) {
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
