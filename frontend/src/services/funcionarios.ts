import api from "./api";
import type { Funcionario } from "../types/funcionario";

export async function listarFuncionarios() {

    const response =
        await api.get<Funcionario[]>("/funcionarios");

    return response.data;
}

export async function criarFuncionario(
    nome: string
) {

    const response =
        await api.post<Funcionario>(
            "/funcionarios",
            { nome }
        );

    return response.data;
}

export async function atualizarFuncionario(
    id: string,
    dados: Partial<Funcionario>
) {

    const response =
        await api.put<Funcionario>(
            `/funcionarios/${id}`,
            dados
        );

    return response.data;
}

export async function excluirFuncionario(
    id: string
) {

    await api.delete(`/funcionarios/${id}`);

}