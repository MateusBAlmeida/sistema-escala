import { Router } from "express";

import EscalasController
    from "../controllers/EscalasController.js";

const router = Router();

router.get(
    "/",
    EscalasController.index
);

router.post(
    "/gerar",
    EscalasController.gerar
);

router.put(
    "/:id",
    EscalasController.atualizar
);

router.delete(
    "/:id",
    EscalasController.excluir
);

export default router;