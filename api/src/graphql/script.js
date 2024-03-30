// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   const newLink = await prisma.link.create({
//     data: {
//       description: "",
//       url: ""
//     }
//   });
//   const allLinks = await prisma.link.findMany();
// };

// main()
//   .catch((error) => {
//     throw error;
//   })
//   .finally(async () => {
//     prisma.$disconnect;
//   });