import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

//import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Funcionarios from "./pages/Funcionarios";
import Ferias from "./pages/Ferias";
import Escalas from "./pages/Escalas";

export default function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* Rota pública */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        element={<ProtectedRoute />}
                    >

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/funcionarios"
                            element={<Funcionarios />}
                        />

                        <Route
                            path="/ferias"
                            element={<Ferias />}
                        />

                        <Route
                            path="/escalas"
                            element={<Escalas />}
                        />

                    </Route>

                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );
}