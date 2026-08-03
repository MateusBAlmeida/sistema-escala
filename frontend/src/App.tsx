import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Funcionarios from "./pages/Funcionarios";
import Ferias from "./pages/Ferias";
import Escalas from "./pages/Escalas";

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    element={<Layout />}
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

        </BrowserRouter>

    );
}