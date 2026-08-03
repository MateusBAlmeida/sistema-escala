import dayjs from "dayjs";

export function adicionarDias(data, quantidade) {
    return dayjs(data)
        .add(quantidade, "day")
        .format("YYYY-MM-DD");
}

export function ehDiaUtil(data) {
    const diaSemana = dayjs(data).day();

    return diaSemana !== 0 && diaSemana !== 6;
}

export function contarDiasUteis(inicio, fim) {
    let data = dayjs(inicio);
    const dataFinal = dayjs(fim);

    let quantidade = 0;

    while (
        data.isBefore(dataFinal) ||
        data.isSame(dataFinal, "day")
    ) {
        if (ehDiaUtil(data)) {
            quantidade++;
        }

        data = data.add(1, "day");
    }

    return quantidade;
}

export function adicionarDiasUteis(dataInicial, quantidade) {
    let data = dayjs(dataInicial);
    let diasUteis = 0;

    while (diasUteis < quantidade) {

        if (ehDiaUtil(data)) {
            diasUteis++;
        }

        if (diasUteis < quantidade) {
            data = data.add(1, "day");
        }
    }

    return data.format("YYYY-MM-DD");
}

export function gerarPeriodoEscala(dataInicial) {

    const inicio = dayjs(dataInicial);

    const fim = dayjs(
        adicionarDiasUteis(
            dataInicial,
            10
        )
    );

    return {
        inicio: inicio.format("YYYY-MM-DD"),

        fim: fim.format("YYYY-MM-DD"),

        diasUteis: contarDiasUteis(
            inicio,
            fim
        )
    };
}

export function proximoDiaUtil(data) {

    let proximaData = dayjs(data).add(1, "day");

    while (!ehDiaUtil(proximaData)) {
        proximaData = proximaData.add(1, "day");
    }

    return proximaData.format("YYYY-MM-DD");
}