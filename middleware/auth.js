import jwt from 'jsonwebtoken';
const chavePrivada = "Fasipe2024"

export default function auth(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        error: 'Token não encontrado',
      })
    }

    //const token = req.headers["authorization"];
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, chavePrivada, (err, decoded) => {
      if (err) {
        console.log(`Token Split Não Autorizado: ${token}`)
        console.log(`Token cru: ${req.headers["authorization"]}`)
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

export function teste(tipoPermissoes) {
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
