import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create roles
    const userRole = await prisma.role.upsert({
        where: { id: 'user' },
        update: {},
        create: {
            id: 'user',
            name: 'User'
        },
    });

    const adminRole = await prisma.role.upsert({
        where: { id: 'admin' },
        update: {},
        create: {
            id: 'admin',
            name: 'Admin'
        },
    });

    console.log({ userRole, adminRole });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });