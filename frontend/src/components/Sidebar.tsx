import {
    CalendarDays,
    CalendarOff,
    LayoutDashboard,
    Users
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
    {
        to: "/",
        label: "Dashboard",
        icon: LayoutDashboard
    },
    {
        to: "/funcionarios",
        label: "Funcionários",
        icon: Users
    },
    {
        to: "/ferias",
        label: "Férias",
        icon: CalendarOff
    },
    {
        to: "/escalas",
        label: "Escalas",
        icon: CalendarDays
    }
];

export default function Sidebar() {

    return (

        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white">

            <div className="p-6">

                <h1 className="text-xl font-bold">
                    Escala Fácil
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Gerenciador de escalas
                </p>

            </div>

            <nav className="px-3">

                {links.map(link => {

                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >

                            <Icon size={20} />

                            {link.label}

                        </NavLink>
                    );

                })}

            </nav>

        </aside>
    );
}