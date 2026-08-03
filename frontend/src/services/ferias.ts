import api from "./api";

import type { Ferias } from "../types/ferias";

export async function listarFerias() {

    const response =
        await api.get<Ferias[]>("/ferias");

    return response.data;

}

export async function criarFerias(
    dados: Omit<Ferias, "id" | "funcionario">
) {

    const response =
        await api.post<Ferias>(
            "/ferias",
            dados
        );

    return response.data;

}

export async function excluirFerias(
    id: string
) {

    await api.delete(
        `/ferias/${id}`
    );

}