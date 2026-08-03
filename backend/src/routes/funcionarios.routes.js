import { Router } from "express";

import FuncionariosController from "../controllers/FuncionariosController.js";

const router = Router();

router.get("/", FuncionariosController.index);

router.get("/:id", FuncionariosController.show);

router.post("/", FuncionariosController.store);

router.put("/:id", FuncionariosController.update);

router.delete("/:id", FuncionariosController.delete);

export default router;