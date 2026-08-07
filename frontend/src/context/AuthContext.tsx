import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../services/api";

interface Usuario {
  id: string;
  nome: string;
  username: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  autenticado: boolean;
  carregando: boolean;
  login: (username: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [usuario, setUsuario] =
    useState<Usuario | null>(() => {
      const dados = localStorage.getItem("usuario");

      return dados ? JSON.parse(dados) : null;
    });

  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem("token")
    );

  const [carregando, setCarregando] =
    useState(true);

  useEffect(() => {
    setCarregando(false);
  }, []);

  async function login(
    username: string,
    senha: string
  ) {
    const response = await api.post("/auth/login", {
      username,
      senha,
    });

    const {
      token: novoToken,
      usuario: novoUsuario,
    } = response.data;

    localStorage.setItem("token", novoToken);
    localStorage.setItem(
      "usuario",
      JSON.stringify(novoUsuario)
    );

    setToken(novoToken);
    setUsuario(novoUsuario);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);

    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado: Boolean(token),
        carregando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider"
    );
  }

  return context;
}