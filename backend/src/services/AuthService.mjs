import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UsuarioRepository
    from "../repositories/UsuarioRepository.mjs";

class AuthService {

    async login(username, senha) {

        const usuario =
            await UsuarioRepository.buscarPorUsername(
                username
            );

        if (!usuario || !usuario.ativo) {

            throw new Error(
                "Usuário ou senha inválidos"
            );

        }

        const senhaValida =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaValida) {

            throw new Error(
                "Usuário ou senha inválidos"
            );

        }

        const token = jwt.sign(
            {
                id: usuario.id,
                username: usuario.username,
                nome: usuario.nome
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "8h"
            }
        );

        return {
            token,

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                username: usuario.username
            }
        };
    }
}

export default new AuthService();