import email from "infra/email.js";
import database from "infra/database.js";
import webserver from "infra/webserver.js";
import { NotFoundError } from "infra/errors";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function findOneValidById(tokenID) {
  const activationTokenObject = await runSelectQuery(tokenID);

  return activationTokenObject;

  async function runSelectQuery(tokenID) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE   
          id = $1
          AND expires_at > NOW()
          AND used_at IS NULL
        LIMIT 
          1
      ;`,
      values: [tokenID],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação não foi encontrado no sistema ou expirou.",
        action:
          "Faça um novo cadastro para receber um novo e-mail de ativação.",
      });
    }
    return results.rows[0];
  }
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const result = await database.query({
      text: `
        INSERT INTO 
          user_activation_tokens (user_id, expires_at)
        VALUES 
          ($1, $2)
        RETURNING
          *
      ;`,
      values: [userId, expiresAt],
    });

    return result.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "TesteEtc <contato@teste.com.br>",
    to: user.email,
    subject: "Ative seu cadastro na plataforma!",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro:
    
${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe TesteEtc`,
  });
}

const activation = {
  findOneValidById,
  create,
  sendEmailToUser,
};

export default activation;
