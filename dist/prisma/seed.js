"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt.hash('admin123', 10);
    const existing = await prisma.user.findUnique({ where: { email: 'admin@juansao.com' } });
    if (!existing) {
        const user = await prisma.user.create({
            data: {
                email: 'admin@juansao.com',
                name: 'Juan Sao Ville',
                password,
                role: client_1.Role.ADMIN,
            },
        });
        console.log('Created admin user:', user.email);
    }
    else {
        console.log('Admin user already exists:', existing.email);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map