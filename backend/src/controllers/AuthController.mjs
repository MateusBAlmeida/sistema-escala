import AuthService
    from "../services/AuthService.mjs";

class AuthController {

    async login(req, res) {

        try {

            const {
                username,
                senha
            } = req.body;

            if (!username || !senha) {

                return res.status(400).json({
                    erro: "Usuário e senha são obrigatórios"
                });

            }

            const resultado =
                await AuthService.login(
                    username,
                    senha
                );

            return res.json(resultado);

        } catch (error) {

            console.error(
                "Erro no login:",
                error
            );

            return res.status(401).json({
                erro: "Usuário ou senha inválidos"
            });

        }
    }
}

export default new AuthController();