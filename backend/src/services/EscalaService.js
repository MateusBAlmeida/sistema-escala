import funcionariosRepository from "../repositories/FuncionariosRepository.ts";
import feriasRepository from "../repositories/FeriasRepository.ts";
import escalasRepository from "../repositories/EscalasRepository.ts";

import ScoreService from "./ScoreService.js";

import {
    gerarPeriodoEscala,
    proximoDiaUtil,
    contarDiasUteis
} from "../utils/dateUtils.js";

class EscalaService {

    async buscarFuncionariosElegiveis(
        funcionarios,
        data,
        ultimaPessoaId
    ) {

        const elegiveis = [];

        for (const funcionario of funcionarios) {

            // Funcionário inativo
            if (!funcionario.ativo) {
                continue;
            }

            // Não repetir consecutivamente
            if (funcionario.id === ultimaPessoaId) {
                continue;
            }

            // Verifica férias
            const indisponivel =
                await feriasRepository
                    .funcionarioEstaIndisponivel(
                        funcionario.id,
                        data
                    );

            if (indisponivel) {
                continue;
            }

            elegiveis.push(funcionario);
        }

        return elegiveis;
    }

    selecionarFuncionario(
        funcionarios,
        ultimaPessoaId,
        data
    ) {

        const avaliados = funcionarios.map(funcionario => {

            const score =
                ScoreService.calcular(
                    funcionario,
                    ultimaPessoaId,
                    data
                );

            return {
                funcionario,
                score
            };

        });

        avaliados.sort((a, b) => {

            if (b.score !== a.score) {
                return b.score - a.score;
            }

            return a.funcionario.nome
                .localeCompare(
                    b.funcionario.nome
                );

        });

        return avaliados[0].funcionario;
    }

    async gerar(dataInicial, quantidadeEscalas) {

        const funcionarios =
            await funcionariosRepository.listar();

        if (funcionarios.length === 0) {

            throw new Error(
                "Não existem funcionários cadastrados."
            );

        }

        const escalasGeradas = [];

        let dataAtual = dataInicial;

        let ultimaPessoaId = null;

        for (
            let i = 0;
            i < quantidadeEscalas;
            i++
        ) {

            const periodo =
                gerarPeriodoEscala(dataAtual);

            const elegiveis =
                await this.buscarFuncionariosElegiveis(
                    funcionarios,
                    periodo.inicio,
                    ultimaPessoaId
                );

            if (elegiveis.length === 0) {

                throw new Error(
                    `Não existem funcionários disponíveis para a escala de ${periodo.inicio}.`
                );

            }

            const escolhido =
                this.selecionarFuncionario(
                    elegiveis,
                    ultimaPessoaId,
                    periodo.inicio
                );

            const escala = {
                funcionarioId: escolhido.id,
                inicio: periodo.inicio,
                fim: periodo.fim,
                diasUteis: periodo.diasUteis,
                status: "programada"
            };

            escalasGeradas.push(escala);

            // Atualiza informações do funcionário
            escolhido.totalEscalas =
                (escolhido.totalEscalas || 0) + 1;

            escolhido.ultimaEscala =
                periodo.inicio;

            ultimaPessoaId =
                escolhido.id;

            dataAtual = proximoDiaUtil(periodo.fim);
        }

        // Salva histórico
        for (const escala of escalasGeradas) {

            await escalasRepository.criar(
                escala
            );

        }

        // Atualiza funcionários
        for (const funcionario of funcionarios) {

            await funcionariosRepository.atualizar(
                funcionario.id,
                {
                    totalEscalas:
                        funcionario.totalEscalas,

                    ultimaEscala:
                        funcionario.ultimaEscala
                }
            );

        }

        return escalasGeradas;
    }

    async listar() {

        return await escalasRepository.listar();

    }

    async atualizar(id, dados) {

        const escala =
            await escalasRepository.buscar(id);

        if (!escala) {
            return null;
        }

        const funcionarioId =
            dados.funcionarioId ??
            escala.funcionarioId;

        const funcionario =
            await funcionariosRepository.buscar(funcionarioId);

        if (!funcionario) {

            throw new Error(
                "Funcionário não encontrado."
            );

        }

        const atualizada = {

            ...escala,

            funcionarioId,

            funcionario: funcionario.nome,

            inicio:
                dados.inicio ??
                escala.inicio,

            fim:
                dados.fim ??
                escala.fim,

            diasUteis:
                dados.diasUteis ??
                escala.diasUteis,

            status:
                dados.status ??
                escala.status

        };

        await this.recalcularEstatisticas();

        return await escalasRepository.atualizar(
            id,
            atualizada
        );

    }

    async excluir(id) {

        await escalasRepository.excluir(id);

        await this.recalcularEstatisticas();

        return true;
    }

    async recalcularEstatisticas() {

        const funcionarios =
            await funcionariosRepository.listar();

        const escalas =
            await escalasRepository.listar();

        for (const funcionario of funcionarios) {

            const minhasEscalas =
                escalas
                    .filter(
                        escala =>
                            escala.funcionarioId ===
                            funcionario.id
                    );

            funcionario.totalEscalas =
                minhasEscalas.length;

            funcionario.ultimaEscala =
                minhasEscalas.length > 0
                    ? minhasEscalas[
                        minhasEscalas.length - 1
                    ].inicio
                    : null;

            await funcionariosRepository.atualizar(
                funcionario.id,
                {
                    totalEscalas:
                        funcionario.totalEscalas,

                    ultimaEscala:
                        new Date(
                            funcionario.ultimaEscala
                        ).toISOString().split("T")[0] || null
                }
            );
        }

    }
}

export default new EscalaService();