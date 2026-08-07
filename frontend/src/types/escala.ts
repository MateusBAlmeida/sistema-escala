import type { Funcionario } from "./funcionario";

export interface Escala {
    id: string;
    funcionarioId: string;
    funcionario: Funcionario;
    inicio: string;
    fim: string;
    diasUteis: number;
    status: "programada" | "em_andamento" | "concluida";
}