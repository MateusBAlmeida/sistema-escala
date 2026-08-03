import feriasRepository from "../repositories/FeriasRepository.js";
import funcionariosRepository from "../repositories/FuncionariosRepository.js";

import {
    periodoValido,
    periodosSobrepostos
} from "../utils/feriasUtils.js";

class FeriasController {

    async index(req, res, next) {

        try {

            const registros =
                await feriasRepository.findAll();

            const funcionarios =
                await funcionariosRepository.findAll();

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
                await funcionariosRepository.findById(
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
                await feriasRepository.findAll();

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
                await feriasRepository.create({

                    funcionarioId,

                    inicio,

                    fim,

                    motivo: motivo.trim() || "Férias"

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

            const registro =
                await feriasRepository.findById(id);

            if (!registro) {

                return res.status(404).json({
                    erro: "Período de férias não encontrado."
                });

            }

            await feriasRepository.delete(id);

            return res.status(204).send();

        } catch (err) {

            next(err);

        }

    }

}

export default new FeriasController();