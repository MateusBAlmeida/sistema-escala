export interface Funcionario {
    id: string;
    nome: string;
    ativo: boolean;
    prioridade: number;
    ultimaEscala: string | null;
    totalEscalas: number;
}