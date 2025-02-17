import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Import and run the role seed script
    await import('./seed/role.seed'); // Adjust the path if necessary

    // You can add more seed scripts here in the future
    // await import('./seed/other.seed');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });