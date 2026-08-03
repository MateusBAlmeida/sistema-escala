import JsonRepository from "./JsonRepository.js";
import { dataDentroPeriodo } from "../utils/feriasUtils.js";

class FeriasRepository extends JsonRepository {

    constructor() {
        super("ferias.json");
    }

    async funcionarioEstaIndisponivel(funcionarioId, data) {

        const registros = await this.findAll();

        return registros.some(registro =>

            registro.funcionarioId === funcionarioId &&

            dataDentroPeriodo(
                data,
                registro.inicio,
                registro.fim
            )

        );

    }

    async funcionarioIndisponivelNoPeriodo(
        funcionarioId,
        inicio,
        fim
    ) {

        const registros = await this.findAll();

        return registros.some(registro => {

            if (registro.funcionarioId !== funcionarioId) {
                return false;
            }

            return (
                registro.inicio <= fim &&
                registro.fim >= inicio
            );

        });
    }

}

export default new FeriasRepository();