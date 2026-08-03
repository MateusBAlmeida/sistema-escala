import api from "./api";
import type { Escala } from "../types/escala";

interface GerarEscalasResponse {
    quantidade: number;
    escalas: Escala[];
}

export async function listarEscalas() {

    const response =
        await api.get<Escala[]>("/escalas");

    return response.data;

}

export async function gerarEscalas(
    dataInicial: string,
    quantidadeEscalas: number
) {

    const response =
        await api.post<GerarEscalasResponse>(
            "/escalas/gerar",
            {
                dataInicial,
                quantidadeEscalas
            }
        );

    return response.data;

}

export async function atualizarEscala(
    id: string,
    dados: Partial<Escala>
) {

    const response =
        await api.put<Escala>(
            `/escalas/${id}`,
            dados
        );

    return response.data;

}

export async function excluirEscala(
    id: string
) {

    await api.delete(
        `/escalas/${id}`
    );

}