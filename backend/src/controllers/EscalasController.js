import EscalaService from "../services/EscalaService.js";

class EscalasController {

    async index(req, res, next) {

        try {

            const escalas =
                await EscalaService.listar();

            return res.json(escalas);

        } catch (err) {

            next(err);

        }

    }

    async gerar(req, res, next) {

        try {

            const {
                dataInicial,
                quantidadeEscalas
            } = req.body;

            if (!dataInicial) {

                return res.status(400).json({
                    erro: "Data inicial é obrigatória."
                });

            }

            const quantidade =
                Number(quantidadeEscalas);

            if (
                !Number.isInteger(quantidade) ||
                quantidade < 1
            ) {

                return res.status(400).json({
                    erro: "Quantidade de escalas inválida."
                });

            }

            const escalas =
                await EscalaService.gerar(
                    dataInicial,
                    quantidade
                );

            return res.status(201).json({
                quantidade: escalas.length,
                escalas
            });

        } catch (err) {

            next(err);

        }

    }

    async atualizar(req, res, next) {

        try {

            const escala =
                await EscalaService.atualizar(
                    req.params.id,
                    req.body
                );

            if (!escala) {

                return res.status(404).json({
                    erro: "Escala não encontrada."
                });

            }

            return res.json(escala);

        } catch (err) {

            next(err);

        }

    }

    async excluir(req, res, next) {

        try {

            const removida =
                await EscalaService.excluir(
                    req.params.id
                );

            if (!removida) {

                return res.status(404).json({
                    erro: "Escala não encontrada."
                });

            }

            return res.status(204).send();

        } catch (err) {

            next(err);

        }

    }

}

export default new EscalasController();