import { Router } from "express";

import AuthController
    from "../controllers/AuthController.mjs";

const router = Router();

router.post(
    "/login",
    (req, res) =>
        AuthController.login(req, res)
);

export default router;