import prisma from "../lib/prisma.mjs";

class UsuarioRepository {

    async buscarPorUsername(username) {

        return prisma.usuario.findUnique({
            where: {
                username
            }
        });

    }

    async criar(data) {

        return prisma.usuario.create({
            data
        });

    }

}

export default new UsuarioRepository();