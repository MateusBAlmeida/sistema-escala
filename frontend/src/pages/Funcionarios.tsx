import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    Pencil,
    Trash2,
    User2Icon,
    UsersIcon
} from "lucide-react";

import type { Funcionario } from "../types/funcionario";

import {
    listarFuncionarios,
    criarFuncionario,
    atualizarFuncionario,
    excluirFuncionario
} from "../services/funcionarios";

export default function Funcionarios() {

    const [
        funcionarios,
        setFuncionarios
    ] = useState<Funcionario[]>([]);

    const [
        nome,
        setNome
    ] = useState("");

    const [
        carregando,
        setCarregando
    ] = useState(true);

    async function carregar() {

        try {

            setCarregando(true);

            const dados =
                await listarFuncionarios();

            setFuncionarios(dados);

        } finally {

            setCarregando(false);

        }
    }

    useEffect(() => {

        carregar();

    }, []);

    async function adicionar() {

        if (!nome.trim()) {
            return;
        }

        await criarFuncionario(nome);

        setNome("");

        await carregar();
    }

    async function alternarStatus(
        funcionario: Funcionario
    ) {

        await atualizarFuncionario(
            funcionario.id,
            {
                ativo: !funcionario.ativo
            }
        );

        await carregar();
    }

    async function remover(
        funcionario: Funcionario
    ) {

        const confirmar =
            window.confirm(
                `Deseja excluir ${funcionario.nome}?`
            );

        if (!confirmar) {
            return;
        }

        await excluirFuncionario(
            funcionario.id
        );

        await carregar();
    }

    return (

        <div>

            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <UsersIcon
                        size={32}
                        className="text-slate-700"
                    />

                    <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                            Funcionários
                        </h2>

                        <p className="mt-1 text-slate-500">
                            Gerencie os funcionários disponíveis
                            para as escalas.
                        </p>

                    </div>
                </div>

            </div>

            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="flex gap-3">

                    <input
                        value={nome}
                        onChange={e =>
                            setNome(e.target.value)
                        }
                        onKeyDown={e => {

                            if (e.key === "Enter") {
                                adicionar();
                            }

                        }}
                        placeholder="Nome do funcionário"
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                    />

                    <button
                        onClick={adicionar}
                        className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-800"
                    >

                        <Plus size={20} />

                        Adicionar

                    </button>

                </div>

            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                {carregando ? (

                    <div className="p-8 text-center text-slate-500">
                        Carregando...
                    </div>

                ) : funcionarios.length === 0 ? (

                    <div className="p-8 text-center text-slate-500">
                        Nenhum funcionário cadastrado.
                    </div>

                ) : (

                    <table className="w-full">

                        <thead className="border-b bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Nome
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Escalas
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-semibold">
                                    Ações
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {funcionarios.map(funcionario => (

                                <tr
                                    key={funcionario.id}
                                    className="border-b last:border-0"
                                >

                                    <td className="px-6 py-4 font-medium">
                                        {funcionario.nome}
                                    </td>

                                    <td className="px-6 py-4 text-slate-500">
                                        {funcionario.totalEscalas}
                                    </td>

                                    <td className="px-6 py-4">

                                        <button
                                            onClick={() =>
                                                alternarStatus(
                                                    funcionario
                                                )
                                            }
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${funcionario.ativo
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >

                                            {funcionario.ativo
                                                ? "Ativo"
                                                : "Inativo"
                                            }

                                        </button>

                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex justify-end gap-2">

                                            <button
                                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    remover(
                                                        funcionario
                                                    )
                                                }
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}