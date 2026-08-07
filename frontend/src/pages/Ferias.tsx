import {
    useEffect,
    useState
} from "react";

import {
    CalendarOff,
    Plus,
    Trash2
} from "lucide-react";

import type { Funcionario } from "../types/funcionario";
import type { Ferias as FeriasType } from "../types/ferias";

import {
    listarFuncionarios
} from "../services/funcionarios";

import {
    listarFerias,
    criarFerias,
    excluirFerias
} from "../services/ferias";

function formatarData(data: string) {

    return new Date(
        `${data}`
    ).toLocaleDateString("pt-BR", { timeZone: "UTC" });

}

export default function Ferias() {

    const [
        funcionarios,
        setFuncionarios
    ] = useState<Funcionario[]>([]);

    const [
        ferias,
        setFerias
    ] = useState<FeriasType[]>([]);

    const [
        funcionarioId,
        setFuncionarioId
    ] = useState("");

    const [
        inicio,
        setInicio
    ] = useState("");

    const [
        fim,
        setFim
    ] = useState("");

    const [
        motivo,
        setMotivo
    ] = useState("Férias");

    const [
        carregando,
        setCarregando
    ] = useState(true);

    const [
        salvando,
        setSalvando
    ] = useState(false);

    async function carregar() {

        try {

            setCarregando(true);

            const [
                funcionariosData,
                feriasData
            ] = await Promise.all([
                listarFuncionarios(),
                listarFerias()
            ]);

            setFuncionarios(
                funcionariosData
            );

            setFerias(
                feriasData
            );

        } finally {

            setCarregando(false);

        }

    }

    useEffect(() => {

        carregar();

    }, []);

    async function cadastrar() {

        if (!funcionarioId) {

            alert(
                "Selecione um funcionário."
            );

            return;
        }

        if (!inicio || !fim) {

            alert(
                "Informe as datas de início e fim."
            );

            return;
        }

        if (inicio > fim) {

            alert(
                "A data inicial não pode ser maior que a data final."
            );

            return;
        }

        try {

            setSalvando(true);

            await criarFerias({

                funcionarioId,

                inicio,

                fim,

                motivo:
                    motivo.trim() || "Férias"

            });

            setFuncionarioId("");

            setInicio("");

            setFim("");

            setMotivo("Férias");

            await carregar();

        } catch (error: any) {

            alert(
                error.response?.data?.erro ||
                "Não foi possível cadastrar o período."
            );

        } finally {

            setSalvando(false);

        }

    }

    async function remover(
        registro: FeriasType
    ) {

        const confirmar =
            window.confirm(
                `Excluir o período de ${registro.funcionario}?`
            );

        if (!confirmar) {
            return;
        }

        try {

            await excluirFerias(
                registro.id
            );

            await carregar();

        } catch (error: any) {

            alert(
                error.response?.data?.erro ||
                "Não foi possível excluir o período."
            );

        }

    }

    return (

        <div>

            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <CalendarOff
                        size={32}
                        className="text-slate-700"
                    />

                    <div>

                        <h2 className="text-3xl font-bold text-slate-800">
                            Férias
                        </h2>

                        <p className="mt-1 text-slate-500">
                            Registre os períodos em que os funcionários
                            estarão indisponíveis.
                        </p>

                    </div>

                </div>

            </div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">

                <h3 className="mb-5 text-lg font-semibold text-slate-800">
                    Novo período
                </h3>

                <div className="grid gap-5 md:grid-cols-4">

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Funcionário
                        </label>

                        <select
                            value={funcionarioId}
                            onChange={e =>
                                setFuncionarioId(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-500"
                        >

                            <option value="">
                                Selecione...
                            </option>

                            {funcionarios
                                .filter(
                                    funcionario =>
                                        funcionario.ativo
                                )
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

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Início
                        </label>

                        <input
                            type="date"
                            value={inicio}
                            onChange={e =>
                                setInicio(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Fim
                        </label>

                        <input
                            type="date"
                            value={fim}
                            onChange={e =>
                                setFim(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Motivo
                        </label>

                        <input
                            value={motivo}
                            onChange={e =>
                                setMotivo(
                                    e.target.value
                                )
                            }
                            placeholder="Ex.: Férias"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        />

                    </div>

                </div>

                <div className="mt-5 flex justify-end">

                    <button
                        onClick={cadastrar}
                        disabled={salvando}
                        className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >

                        <Plus size={20} />

                        {salvando
                            ? "Salvando..."
                            : "Cadastrar período"
                        }

                    </button>

                </div>

            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="border-b px-6 py-5">

                    <h3 className="font-semibold text-slate-800">
                        Períodos cadastrados
                    </h3>

                </div>

                {carregando ? (

                    <div className="p-10 text-center text-slate-500">
                        Carregando...
                    </div>

                ) : ferias.length === 0 ? (

                    <div className="p-10 text-center text-slate-500">
                        Nenhum período de férias cadastrado.
                    </div>

                ) : (

                    <div className="divide-y">

                        {ferias.map(registro => (

                            <div
                                key={registro.id}
                                className="flex items-center justify-between px-6 py-5"
                            >

                                <div>

                                    <p className="font-semibold text-slate-800">
                                        {registro.funcionario}
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                                        <span>
                                            {formatarData(
                                                registro.inicio
                                            )}
                                        </span>

                                        <span>→</span>

                                        <span>
                                            {formatarData(
                                                registro.fim
                                            )}
                                        </span>

                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {registro.motivo}
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        remover(
                                            registro
                                        )
                                    }
                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    title="Excluir"
                                >

                                    <Trash2 size={19} />

                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}