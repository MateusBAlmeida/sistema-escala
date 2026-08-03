import {
    CalendarDays,
    CalendarOff,
    ChevronRight,
    LayoutDashboard,
    Users,
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useLocation,
} from "react-router-dom";

const menu = [
    {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Funcionários",
        path: "/funcionarios",
        icon: Users,
    },
    {
        label: "Férias",
        path: "/ferias",
        icon: CalendarOff,
    },
    {
        label: "Escalas",
        path: "/escalas",
        icon: CalendarDays,
    },
];

export default function Layout() {

    const location = useLocation();

    const paginaAtual =
        menu.find(
            item =>
                item.path === location.pathname
        );

    return (

        <div className="min-h-screen bg-slate-50">

            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col">

                <div className="flex h-20 items-center border-b border-slate-800 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">

                            <CalendarDays
                                size={22}
                            />

                        </div>

                        <div>

                            <p className="text-lg font-bold tracking-tight text-white">
                                Escala
                            </p>

                            <p className="text-xs text-slate-400">
                                Gestão de escalas
                            </p>

                        </div>

                    </div>

                </div>

                <nav className="flex-1 space-y-1 px-3 py-6">

                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Menu principal
                    </p>

                    {menu.map(item => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    [
                                        "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                                        isActive
                                            ? "bg-blue-600 text-slate-950 shadow-sm"
                                            : "text-white bg-gray-400 hover:bg-white/100 hover:text-white"
                                    ].join(" ")
                                }
                            >

                                <Icon
                                    size={19}
                                    strokeWidth={1.8}
                                />

                                <span>
                                    {item.label}
                                </span>

                                <ChevronRight
                                    size={15}
                                    className="ml-auto opacity-0 transition group-[.active]:opacity-100"
                                />

                            </NavLink>

                        );

                    })}

                </nav>

                <div className="border-t border-slate-800 p-4">

                    <div className="rounded-xl bg-slate-900 p-4">

                        <p className="text-xs font-medium text-slate-400">
                            Sistema
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                            Gestão de Escalas
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            Controle de jornadas e disponibilidade.
                        </p>

                    </div>

                </div>

            </aside>

            <div className="lg:pl-64">

                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">

                    <div className="flex h-20 items-center justify-between px-6 lg:px-10">

                        <div>

                            <p className="text-sm text-slate-400">
                                Gestão
                            </p>

                            <h1 className="text-lg font-semibold text-slate-800">
                                {paginaAtual?.label}
                            </h1>

                        </div>

                        <div className="flex items-center gap-3">

                            <div className="hidden text-right sm:block">

                                <p className="text-sm font-semibold text-slate-700">
                                    Administrador
                                </p>

                                <p className="text-xs text-slate-400">
                                    Gestão de escalas
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                                A
                            </div>

                        </div>

                    </div>

                </header>

                <main className="p-6 lg:p-10">

                    <div className="mx-auto max-w-7xl">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>

    );
}