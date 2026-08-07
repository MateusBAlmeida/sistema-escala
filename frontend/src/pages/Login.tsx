import {
  FormEvent,
  useState,
} from "react";

import {
  LockKeyhole,
  User,
  LogIn,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [username, setUsername] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [erro, setErro] =
    useState("");

  const [carregando, setCarregando] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro("");

    if (!username || !senha) {
      setErro(
        "Informe o usuário e a senha."
      );

      return;
    }

    try {
      setCarregando(true);

      await login(username, senha);

      navigate("/", {
        replace: true,
      });
    } catch (error: any) {
      setErro(
        error.response?.data?.erro ||
          "Usuário ou senha inválidos."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

          <div className="px-8 pt-8 pb-6">

            <div className="flex justify-center mb-6">

              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white">
                <LockKeyhole size={26} />
              </div>

            </div>

            <div className="text-center">

              <h1 className="text-2xl font-bold text-slate-900">
                Sistema de Escalas
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Entre com suas credenciais
                administrativas
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="px-8 pb-8 space-y-5"
          >

            {erro && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <div>

              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Usuário
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="Digite seu usuário"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

              </div>

            </div>

            <div>

              <label
                htmlFor="senha"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Senha
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) =>
                    setSenha(
                      event.target.value
                    )
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {carregando ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={18} />

                  Entrar
                </>
              )}

            </button>

          </form>

        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Acesso restrito
        </p>

      </div>

    </main>
  );
}