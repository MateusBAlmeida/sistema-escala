import prisma from "../lib/prisma.ts";

class FeriasRepository {

    async listar() {

        return prisma.ferias.findMany({

            include: {
                funcionario: true,
            },

        });

    }

    async criar(data: {

        funcionarioId: string;

        inicio: Date;

        fim: Date;

    }) {

        return prisma.ferias.create({

            data,

        });

    }

    async excluir(id: string) {

        return prisma.ferias.delete({

            where: {
                id,
            },

        });

    }

}

export default new FeriasRepository();