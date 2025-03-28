import jwt from 'jsonwebtoken';
const chavePrivada = "Fasipe2024"

export default function auth(request, response, next) {
  try {
    if (!request.headers.authorization) {
      return response.status(403).json({
        error: 'Token não encontrado',
      })
    }

    const token = request.headers["authorization"];

    jwt.verify(token, chavePrivada, (err, decoded) => {
      if (err) {
        return response.status(401).json({
          message: 'Usuário não autorizado. (TOKEN)',
        })
      }

      request['payload'] = decoded
      next()
    })
  } catch (err) {
    return response.status(500).send({ error: 'ERRO INTERNO' })
  }
}