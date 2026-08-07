import {
    CalendarDays,
    CalendarOff,
    ChevronRight,
    Clock3,
    Users,
} from "lucide-react";
import { useState, useEffect } from "react";

import type { Escala } from "../types/escala";
import type { Funcionario } from "../types/funcionario";
import type { Ferias } from "../types/ferias";

import { Link } from "react-router-dom";
import { listarFuncionarios } from "../services/funcionarios";
import { listarEscalas } from "../services/escalas";
import { listarFerias } from "../services/ferias";

export default function Dashboard() {

    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [escalas, setEscalas] = useState<Escala[]>([]);
    const [ferias, setFerias] = useState<Ferias[]>([]);

    async function carregar() {
        try {
        const [
            escalasData,
            funcionariosData,
            feriasData
        ] = await Promise.all([
            listarEscalas(),
            listarFuncionarios(),
            listarFerias()
        ]);

        setFuncionarios(funcionariosData);
        setEscalas(escalasData);
        setFerias(feriasData);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }


    }

    useEffect(() => {
        carregar();
    }, []);

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

            <div className="mb-10">

                <p className="mb-2 text-sm font-medium text-slate-400">
                    Visão geral
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Olá, administrador
                </h2>

                <p className="mt-2 text-slate-500">
                    Acompanhe funcionários, férias e escalas da equipe.
                </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Funcionários"
                    value={funcionarios.length}
                    description="Funcionários ativos"
                    icon={Users}
                />

                <StatCard
                    title="Escalas"
                    value={escalas.length}
                    description="Escalas cadastradas"
                    icon={CalendarDays}
                />

                <StatCard
                    title="Próxima escala"
                    value={proximaEscala ? proximaEscala.funcionario.nome : "Nenhuma"}
                    icon={Clock3}
                />

                <StatCard
                    title="Férias"
                    value={ferias.length}
                    description="Períodos cadastrados"
                    icon={CalendarOff}
                />

            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">


                <div className="rounded-2xl border border-slate-200 bg-white p-6">

                    <h3 className="font-semibold text-slate-900">
                        Ações rápidas
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Acesse as principais funções.
                    </p>

                    <div className="mt-6 space-y-3">

                        <QuickAction
                            to="/funcionarios"
                            icon={Users}
                            title="Funcionários"
                            description="Gerenciar equipe"
                        />

                        <QuickAction
                            to="/ferias"
                            icon={CalendarOff}
                            title="Cadastrar férias"
                            description="Registrar indisponibilidade"
                        />

                        <QuickAction
                            to="/escalas"
                            icon={CalendarDays}
                            title="Gerar escala"
                            description="Criar novo cronograma"
                        />

                    </div>

                </div>

            </div>

        </div>

    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: any) {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>

                </div>

                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">

                    <Icon size={21} />

                </div>

            </div>

        </div>

    );
}

function QuickAction({
    to,
    icon: Icon,
    title,
    description,
}: any) {

    return (

        <Link
            to={to}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
        >

            <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700">

                <Icon size={19} />

            </div>

            <div className="flex-1">

                <p className="text-sm font-semibold text-slate-800">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                </p>

            </div>

            <ChevronRight
                size={17}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
            />

        </Link>

    );
}