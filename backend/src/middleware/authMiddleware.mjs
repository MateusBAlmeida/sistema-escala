import jwt from "jsonwebtoken";

export function autenticar(req, res, next) {

    try {

        const authorization =
            req.headers.authorization;

        if (!authorization) {

            return res.status(401).json({
                erro: "Token não informado"
            });

        }

        const [tipo, token] =
            authorization.split(" ");

        if (
            tipo !== "Bearer" ||
            !token
        ) {

            return res.status(401).json({
                erro: "Token inválido"
            });

        }

        const payload =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.usuario = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            erro: "Sessão inválida ou expirada"
        });

    }
}