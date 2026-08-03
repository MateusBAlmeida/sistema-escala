import dayjs from "dayjs";

class ScoreService {

    calcular(funcionario, ultimaPessoaId, dataReferencia) {

        let score = 0;

        // Funcionários com menos escalas têm preferência
        score += (100 - funcionario.totalEscalas * 10);

        // Prioridade configurável
        score += funcionario.prioridade * 20;

        // Nunca escolher o mesmo funcionário consecutivamente
        if (funcionario.id === ultimaPessoaId) {
            score -= 10000;
        }

        // Quanto mais tempo desde a última escala,
        // maior a pontuação.
        if (funcionario.ultimaEscala) {

            const diasDesdeUltimaEscala =
                dayjs(dataReferencia)
                    .diff(
                        dayjs(funcionario.ultimaEscala),
                        "day"
                    );

            score += Math.min(
                diasDesdeUltimaEscala,
                100
            );

        } else {

            // Nunca escalado recebe uma vantagem
            score += 100;

        }

        return score;
    }

}

export default new ScoreService();