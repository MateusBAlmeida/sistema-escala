import JsonRepository from "./JsonRepository.js";

class EscalasRepository extends JsonRepository {

    constructor() {
        super("escalas.json");
    }

    async findByFuncionario(funcionarioId) {

        const escalas = await this.findAll();

        return escalas.filter(
            escala =>
                escala.funcionarioId === funcionarioId
        );

    }

    async deleteByFuncionario(funcionarioId) {

        const escalas = await this.findAll();

        const restantes = escalas.filter(
            escala =>
                escala.funcionarioId !== funcionarioId
        );

        await this.write(restantes);
    }

}

export default new EscalasRepository();