import feriasRepository from "../repositories/FeriasRepository.ts";
import funcionariosRepository from "../repositories/FuncionariosRepository.ts";

import {
    periodoValido,
    periodosSobrepostos
} from "../utils/feriasUtils.js";

class FeriasController {

    async index(req, res, next) {

        try {

            const registros =
                await feriasRepository.listar();

            const funcionarios =
                await funcionariosRepository.listar();

            const resultado = registros.map(registro => {

                const funcionario =
                    funcionarios.find(
                        f => f.id === registro.funcionarioId
                    );

                return {
                    ...registro,

                    funcionario: funcionario
                        ? funcionario.nome
                        : "Funcionário não encontrado"
                };

            });

            return res.json(resultado);

        } catch (err) {

            next(err);

        }

    }

    async store(req, res, next) {

        try {

            const {
                funcionarioId,
                inicio,
                fim,
                motivo = "Férias"
            } = req.body;

            if (!funcionarioId) {

                return res.status(400).json({
                    erro: "Funcionário é obrigatório."
                });

            }

            if (!inicio || !fim) {

                return res.status(400).json({
                    erro:
                        "Data inicial e final são obrigatórias."
                });

            }

            const funcionario =
                await funcionariosRepository.buscar(
                    funcionarioId
                );

            if (!funcionario) {

                return res.status(404).json({
                    erro: "Funcionário não encontrado."
                });

            }

            if (!periodoValido(inicio, fim)) {

                return res.status(400).json({
                    erro: "O período informado é inválido."
                });

            }

            const registros =
                await feriasRepository.listar();

            const conflito =
                registros.find(registro =>

                    registro.funcionarioId === funcionarioId &&

                    periodosSobrepostos(
                        inicio,
                        fim,
                        registro.inicio,
                        registro.fim
                    )

                );

            if (conflito) {

                return res.status(409).json({
                    erro:
                        "Este funcionário já possui um período de férias que conflita com as datas informadas."
                });

            }

            const nova =
                await feriasRepository.criar({

                    funcionarioId,

                    inicio: new Date(inicio),

                    fim: new Date(fim),

                });

            return res.status(201).json({

                ...nova,

                funcionario: funcionario.nome

            });

        } catch (err) {

            next(err);

        }

    }

    async delete(req, res, next) {

        try {

            const { id } = req.params;

            // const registro =
            //     await feriasRepository.buscar(id);

            // if (!registro) {

            //     return res.status(404).json({
            //         erro: "Período de férias não encontrado."
            //     });

            // }

            await feriasRepository.excluir(id);

            return res.status(204).send();

        } catch (err) {

            next(err);

        }

    }

}

export default new FeriasController();