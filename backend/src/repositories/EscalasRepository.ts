import prisma from "../lib/prisma.ts";

class EscalasRepository {

    async listar() {

        return prisma.escala.findMany({

            include: {
                funcionario: true,
            },

            orderBy: {
                inicio: "desc",
            },

        });

    }

    async criar(data: {

        funcionarioId: string;

        funcionarioNome: string;

        inicio: Date;

        fim: Date;

        diasUteis: number;

        status: string;

    }) {

        return prisma.escala.create({

            data,

        });

    }

    async atualizar(id: string, dados: any) {

        return prisma.escala.update({

            where: {
                id,
            },

            data: dados,

        });

    }

    async excluir(id: string) {

        return prisma.escala.delete({

            where: {
                id,
            },

        });

    }

}

export default new EscalasRepository();