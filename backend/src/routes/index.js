import { Router } from "express";

import funcionarios from "./funcionarios.routes.js";
import ferias from "./ferias.routes.js";
import escalas from "./escalas.routes.js";
import auth from "./AuthRoutes.mjs";
import { autenticar } from "../middleware/authMiddleware.mjs";

const router = Router();

router.use("/funcionarios", funcionarios, autenticar);
router.use("/ferias", ferias, autenticar);
router.use("/auth", auth);
router.use("/escalas", escalas, autenticar);

export default router;