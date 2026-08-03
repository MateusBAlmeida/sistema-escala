import { Router } from "express";

import FeriasController
    from "../controllers/FeriasController.js";

const router = Router();

router.get(
    "/",
    FeriasController.index
);

router.post(
    "/",
    FeriasController.store
);

router.delete(
    "/:id",
    FeriasController.delete
);

export default router;