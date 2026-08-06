import prisma from "../lib/prisma.ts";

class FuncionariosRepository {

    async listar() {

        return prisma.funcionario.findMany({

            orderBy: {
                nome: "asc",
            },

        });

    }

    async buscar(id: string) {

        return prisma.funcionario.findUnique({

            where: {
                id,
            },

        });

    }

    async criar(nome: string) {

        return prisma.funcionario.create({

            data: {
                nome,
            },

        });

    }

    async atualizar(id: string, dados: any) {

        return prisma.funcionario.update({

            where: {
                id,
            },

            data: dados,

        });

    }

    async excluir(id: string) {

        return prisma.funcionario.delete({

            where: {
                id,
            },

        });

    }

}

export default new FuncionariosRepository();