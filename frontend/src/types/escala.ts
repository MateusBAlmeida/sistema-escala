export interface Escala {
    id: string;
    funcionarioId: string;
    funcionario: string;
    inicio: string;
    fim: string;
    diasUteis: number;
    status: "programada" | "em_andamento" | "concluida";
}