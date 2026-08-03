import JsonRepository from "./JsonRepository.js";

class FuncionariosRepository extends JsonRepository {

    constructor() {
        super("funcionarios.json");
    }

}

export default new FuncionariosRepository();