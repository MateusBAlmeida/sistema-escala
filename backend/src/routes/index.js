import { Router } from "express";

import funcionarios from "./funcionarios.routes.js";
import ferias from "./ferias.routes.js";
import escalas from "./escalas.routes.js";

const router = Router();

router.use("/funcionarios", funcionarios);
router.use("/ferias", ferias);
router.use("/escalas", escalas);

export default router;