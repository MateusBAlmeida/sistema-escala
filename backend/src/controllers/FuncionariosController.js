import funcionariosRepository from "../repositories/FuncionariosRepository.js";

class FuncionariosController {

    async index(req, res, next) {
        try {
            const funcionarios = await funcionariosRepository.findAll();

            funcionarios.sort((a, b) => a.nome.localeCompare(b.nome));

            return res.json(funcionarios);

        } catch (err) {
            next(err);
        }
    }

    async show(req, res, next) {

        try {

            const funcionario = await funcionariosRepository.findById(req.params.id);

            if (!funcionario) {
                return res.status(404).json({
                    erro: "Funcionário não encontrado."
                });
            }

            return res.json(funcionario);

        } catch (err) {
            next(err);
        }

    }

    async store(req, res, next) {

        try {

            const { nome } = req.body;

            if (!nome?.trim()) {
                return res.status(400).json({
                    erro: "Nome é obrigatório."
                });
            }

            const novo = await funcionariosRepository.create({

                nome,

                ativo: true,

                prioridade: 0,

                ultimaEscala: null,

                totalEscalas: 0

            });

            return res.status(201).json(novo);

        } catch (err) {

            next(err);

        }

    }

    async update(req, res, next) {

        try {

            const atualizado = await funcionariosRepository.update(
                req.params.id,
                req.body
            );

            if (!atualizado) {
                return res.status(404).json({
                    erro: "Funcionário não encontrado."
                });
            }

            return res.json(atualizado);

        } catch (err) {

            next(err);

        }

    }

    async delete(req, res, next) {

        try {

            const funcionario = await funcionariosRepository.findById(req.params.id);

            if (!funcionario) {
                return res.status(404).json({
                    erro: "Funcionário não encontrado."
                });
            }

            await funcionariosRepository.delete(req.params.id);

            return res.status(204).send();

        } catch (err) {

            next(err);

        }

    }

}

export default new FuncionariosController();