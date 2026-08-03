import dayjs from "dayjs";

export function periodoValido(inicio, fim) {
    return dayjs(inicio).isBefore(dayjs(fim)) ||
           dayjs(inicio).isSame(dayjs(fim));
}

export function dataDentroPeriodo(data, inicio, fim) {

    const d = dayjs(data);

    return (
        d.isSame(dayjs(inicio)) ||
        d.isSame(dayjs(fim)) ||
        (d.isAfter(dayjs(inicio)) && d.isBefore(dayjs(fim)))
    );

}

export function periodosSobrepostos(aInicio, aFim, bInicio, bFim) {

    return (
        dayjs(aInicio).isBefore(dayjs(bFim).add(1, "day")) &&
        dayjs(aFim).isAfter(dayjs(bInicio).subtract(1, "day"))
    );

}