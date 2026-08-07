import bcrypt from "bcryptjs";

import prisma from "../src/lib/prisma.ts";

const username = "admin";
const senha = "Admin@00906";

const senhaHash =
    await bcrypt.hash(senha, 12);

const usuario =
    await prisma.usuario.upsert({

        where: {
            username
        },

        update: {},

        create: {
            nome: "Administrador",
            username,
            senha: senhaHash,
            ativo: true
        }
    });

console.log(
    `Usuário criado: ${usuario.username}`
);

await prisma.$disconnect();