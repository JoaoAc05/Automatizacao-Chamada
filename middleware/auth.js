import jwt from 'jsonwebtoken';
const chavePrivada = "Fasipe2024"

export default function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log(`Header: ${req.headers} - authorization ${req.headers.authorization} `)
      return res.status(403).json({
        error: 'Token não encontrado',
      });
    }

    // Tenta extrair o token se vier no formato "Bearer <token>"
    let token = authHeader.split(' ')[1];

    // Se não tiver espaço (formato não é "Bearer <token>"), usa o valor completo como token
    if (!token) {
      token = authHeader;
    }

    jwt.verify(token, chavePrivada, (err, decoded) => {
      if (err) {
        console.log(`Token Split: ${token}`)
        console.log(`Token Header: ${authHeader}`)
        console.log(`Erro: ${err}`)
        return res.status(401).json({
          message: 'Usuário não autorizado. (TOKEN)',
        })
      }

      req['payload'] = decoded
      next() //Após fazer a verificação passa para a próxima função a ser executada
    })
  } catch (err) {
    return res.status(500).send({ error: 'ERRO INTERNO' })
  }
}

export function permissao(tipoPermissoes) {
  return (req, res, next) => {
    try {
      const tipo = req.payload?.tipo;

      if (tipo === undefined) {
        return res.status(403).json({ message: 'Sem nível de permissão' });
      }
      // Os níveis permitidos para o acesso são definitos no ROUTER
      // Caso o tipo informado no payload do token for diferente dos que estiverem na lista definida do ROUTER
      //  Irá dar divergência e retornar 403

      // Verifica se o tipo de usuário está dentro dos níveis permitidos
      if (!tipoPermissoes.includes(tipo))  {
        return res.status(403).json({ message: 'Acesso negado: Permissão insuficiente.' });
      }

      next() //Após fazer a verificação passa para a próxima função a ser executada
    } catch (err) {
      console.log(`ERRO INTERNO PERMISSOES: ${err}`)
      return res.status(500).send({ error: 'ERRO INTERNO' })
    }
  }
}
