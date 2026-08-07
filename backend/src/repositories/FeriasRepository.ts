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

    async funcionarioEstaIndisponivel(funcionarioId: string, data: Date) {

        const ferias = await prisma.ferias.findFirst({
            where: {
                funcionarioId,
                inicio: {
                    lte: data+"T00:00:00.000Z",
                },
                fim: {
                    gte: data+"T00:00:00.000Z",
                },
            },
        });

        return ferias !== null;
    }

}

export default new FeriasRepository();