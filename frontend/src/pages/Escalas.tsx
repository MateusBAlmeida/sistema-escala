import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    CalendarDays,
    Pencil,
    Trash2,
    Users,
    WandSparkles
} from "lucide-react";

import type { Escala } from "../types/escala";
import type { Funcionario } from "../types/funcionario";

import {
    listarFuncionarios
} from "../services/funcionarios";

import {
    listarEscalas,
    gerarEscalas,
    atualizarEscala,
    excluirEscala
} from "../services/escalas";

import Modal from "../components/Modal";

function formatarData(data: string) {

    return new Date(
        `${data}T00:00:00`
    ).toLocaleDateString("pt-BR");

}

function statusEscala(
    escala: Escala
) {

    const hoje =
        new Date()
            .toISOString()
            .slice(0, 10);

    if (escala.fim < hoje) {
        return "concluida";
    }

    if (
        escala.inicio <= hoje &&
        escala.fim >= hoje
    ) {
        return "em_andamento";
    }

    return "programada";

}

export default function Escalas() {

    const [
        escalas,
        setEscalas
    ] = useState<Escala[]>([]);

    const [
        funcionarios,
        setFuncionarios
    ] = useState<Funcionario[]>([]);

    const [
        dataInicial,
        setDataInicial
    ] = useState("");

    const [
        quantidade,
        setQuantidade
    ] = useState(10);

    const [
        filtroFuncionario,
        setFiltroFuncionario
    ] = useState("");

    const [
        carregando,
        setCarregando
    ] = useState(true);

    const [
        gerando,
        setGerando
    ] = useState(false);

    const [
        escalaEditando,
        setEscalaEditando
    ] = useState<Escala | null>(null);

    const [
        editFuncionario,
        setEditFuncionario
    ] = useState("");

    const [
        editInicio,
        setEditInicio
    ] = useState("");

    const [
        editFim,
        setEditFim
    ] = useState("");

    async function carregar() {

        try {

            setCarregando(true);

            const [
                escalasData,
                funcionariosData
            ] = await Promise.all([
                listarEscalas(),
                listarFuncionarios()
            ]);

            setEscalas(escalasData);

            setFuncionarios(
                funcionariosData
            );

        } finally {

            setCarregando(false);

        }

    }

    useEffect(() => {

        carregar();

    }, []);

    async function gerar() {

        if (!dataInicial) {

            alert(
                "Informe a data inicial."
            );

            return;
        }

        try {

            setGerando(true);

            await gerarEscalas(
                dataInicial,
                quantidade
            );

            await carregar();

        } catch (error: any) {

            alert(
                error.response?.data?.erro ||
                "Erro ao gerar escala."
            );

        } finally {

            setGerando(false);

        }

    }

    function abrirEdicao(
        escala: Escala
    ) {

        setEscalaEditando(
            escala
        );

        setEditFuncionario(
            escala.funcionarioId
        );

        setEditInicio(
            escala.inicio
        );

        setEditFim(
            escala.fim
        );

    }

    async function salvarEdicao() {

        if (!escalaEditando) {
            return;
        }

        if (!editFuncionario) {

            alert(
                "Selecione um funcionário."
            );

            return;
        }

        if (
            !editInicio ||
            !editFim
        ) {

            alert(
                "Informe as datas."
            );

            return;
        }

        if (editInicio > editFim) {

            alert(
                "A data inicial não pode ser maior que a final."
            );

            return;
        }

        try {

            await atualizarEscala(
                escalaEditando.id,
                {
                    funcionarioId:
                        editFuncionario,

                    inicio:
                        editInicio,

                    fim:
                        editFim,

                    diasUteis:
                        escalaEditando.diasUteis
                }
            );

            setEscalaEditando(
                null
            );

            await carregar();

        } catch (error: any) {

            alert(
                error.response?.data?.erro ||
                "Não foi possível atualizar a escala."
            );

        }

    }

    async function remover(
        escala: Escala
    ) {

        const confirmar =
            window.confirm(
                `Excluir a escala de ${escala.funcionario}?`
            );

        if (!confirmar) {
            return;
        }

        try {

            await excluirEscala(
                escala.id
            );

            await carregar();

        } catch (error: any) {

            alert(
                error.response?.data?.erro ||
                "Não foi possível excluir a escala."
            );

        }

    }

    const escalasFiltradas =
        useMemo(() => {

            return [...escalas]
                .filter(escala => {

                    if (
                        !filtroFuncionario
                    ) {
                        return true;
                    }

                    return (
                        escala.funcionarioId ===
                        filtroFuncionario
                    );

                })
                .sort(
                    (a, b) =>
                        a.inicio.localeCompare(
                            b.inicio
                        )
                );

        }, [
            escalas,
            filtroFuncionario
        ]);

    const proximaEscala =
        [...escalas]
            .filter(
                escala =>
                    escala.inicio >=
                    new Date()
                        .toISOString()
                        .slice(0, 10)
            )
            .sort(
                (a, b) =>
                    a.inicio.localeCompare(
                        b.inicio
                    )
            )[0];

    return (

        <div>

            <div className="mb-8">

                <div className="flex items-center gap-3">
                    
                    <CalendarDays 
                        size={32}
                        className="text-slate-700"
                    />

                    <div>

                    <h2 className="text-3xl font-bold text-slate-800">
                        Escalas
                    </h2>

                    <p className="mt-1 text-slate-500">
                        Gere e acompanhe o cronograma de trabalho.
                    </p>

                    </div>
                </div>

            </div>

            {/* RESUMO */}

            <div className="mb-8 grid gap-5 md:grid-cols-3">

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Funcionários
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {
                                    funcionarios.filter(
                                        f => f.ativo
                                    ).length
                                }
                            </p>

                        </div>

                        <Users
                            className="text-slate-400"
                            size={28}
                        />

                    </div>

                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Escalas
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {escalas.length}
                            </p>

                        </div>

                        <CalendarDays
                            className="text-slate-400"
                            size={28}
                        />

                    </div>

                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <p className="text-sm text-slate-500">
                        Próxima escala
                    </p>

                    {proximaEscala ? (

                        <div className="mt-2">

                            <p className="text-xl font-bold">
                                {proximaEscala.funcionario}
                            </p>

                            <p className="text-sm text-slate-500">
                                {formatarData(
                                    proximaEscala.inicio
                                )}
                            </p>

                        </div>

                    ) : (

                        <p className="mt-2 text-slate-400">
                            Nenhuma programada
                        </p>

                    )}

                </div>

            </div>

            {/* GERADOR */}

            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-5">

                    <h3 className="text-lg font-semibold">
                        Gerar novas escalas
                    </h3>

                    <p className="text-sm text-slate-500">
                        Cada escala possui exatamente 10 dias úteis.
                    </p>

                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    <input
                        type="date"
                        value={dataInicial}
                        onChange={e =>
                            setDataInicial(
                                e.target.value
                            )
                        }
                        className="rounded-lg border px-4 py-3"
                    />

                    <input
                        type="number"
                        min={1}
                        value={quantidade}
                        onChange={e =>
                            setQuantidade(
                                Number(e.target.value)
                            )
                        }
                        className="rounded-lg border px-4 py-3"
                    />

                    <button
                        onClick={gerar}
                        disabled={gerando}
                        className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white disabled:opacity-50"
                    >

                        <WandSparkles size={20} />

                        {gerando
                            ? "Gerando..."
                            : "Gerar escala"
                        }

                    </button>

                </div>

            </div>

            {/* FILTRO */}

            <div className="mb-4 flex justify-end">

                <select
                    value={filtroFuncionario}
                    onChange={e =>
                        setFiltroFuncionario(
                            e.target.value
                        )
                    }
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2"
                >

                    <option value="">
                        Todos os funcionários
                    </option>

                    {funcionarios
                        .sort(
                            (a, b) =>
                                a.nome.localeCompare(
                                    b.nome
                                )
                        )
                        .map(funcionario => (

                            <option
                                key={funcionario.id}
                                value={funcionario.id}
                            >
                                {funcionario.nome}
                            </option>

                        ))}

                </select>

            </div>

            {/* CRONOGRAMA */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="border-b px-6 py-5">

                    <h3 className="font-semibold">
                        Cronograma
                    </h3>

                </div>

                {carregando ? (

                    <div className="p-10 text-center">
                        Carregando...
                    </div>

                ) : escalasFiltradas.length === 0 ? (

                    <div className="p-10 text-center text-slate-500">
                        Nenhuma escala encontrada.
                    </div>

                ) : (

                    <div className="divide-y">

                        {escalasFiltradas.map(
                            escala => {

                                const status =
                                    statusEscala(
                                        escala
                                    );

                                return (

                                    <div
                                        key={escala.id}
                                        className="p-6"
                                    >

                                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                                            <div className="flex items-start gap-4">

                                                <div className="mt-1 rounded-lg bg-slate-100 p-3">

                                                    <CalendarDays
                                                        size={22}
                                                    />

                                                </div>

                                                <div>

                                                    <h4 className="text-lg font-semibold">
                                                        {escala.funcionario?.nome}
                                                    </h4>

                                                    <p className="text-sm text-slate-500">

                                                        {formatarData(
                                                            escala.inicio
                                                        )}

                                                        {" → "}

                                                        {formatarData(
                                                            escala.fim
                                                        )}

                                                    </p>

                                                    <div className="mt-2 flex gap-2">

                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                                                            {escala.diasUteis} dias úteis
                                                        </span>

                                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                                                            {status === "concluida"
                                                                ? "Concluída"
                                                                : status === "em_andamento"
                                                                    ? "Em andamento"
                                                                    : "Programada"
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        abrirEdicao(
                                                            escala
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                                                >

                                                    <Pencil
                                                        size={17}
                                                    />

                                                    Editar

                                                </button>

                                                <button
                                                    onClick={() =>
                                                        remover(
                                                            escala
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >

                                                    <Trash2
                                                        size={17}
                                                    />

                                                    Excluir

                                                </button>

                                            </div>

                                        </div>

                                        <div className="mt-5">

                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                                                <div
                                                    className="h-full rounded-full bg-slate-800"
                                                    style={{
                                                        width:
                                                            status === "concluida"
                                                                ? "100%"
                                                                : status === "em_andamento"
                                                                    ? "50%"
                                                                    : "5%"
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

            {/* MODAL */}

            <Modal
                aberto={
                    escalaEditando !== null
                }
                titulo="Editar escala"
                onClose={() =>
                    setEscalaEditando(null)
                }
            >

                <div className="space-y-5">

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Funcionário
                        </label>

                        <select
                            value={editFuncionario}
                            onChange={e =>
                                setEditFuncionario(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border px-4 py-3"
                        >

                            {funcionarios
                                .filter(
                                    f => f.ativo
                                )
                                .map(
                                    funcionario => (

                                        <option
                                            key={
                                                funcionario.id
                                            }
                                            value={
                                                funcionario.id
                                            }
                                        >
                                            {
                                                funcionario.nome
                                            }
                                        </option>

                                    )
                                )}

                        </select>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Início
                        </label>

                        <input
                            type="date"
                            value={editInicio}
                            onChange={e =>
                                setEditInicio(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border px-4 py-3"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">
                            Fim
                        </label>

                        <input
                            type="date"
                            value={editFim}
                            onChange={e =>
                                setEditFim(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border px-4 py-3"
                        />

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() =>
                                setEscalaEditando(null)
                            }
                            className="rounded-lg border px-4 py-2"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={salvarEdicao}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
                        >
                            Salvar alterações
                        </button>

                    </div>

                </div>

            </Modal>

        </div>
    );
}