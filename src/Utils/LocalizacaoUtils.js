// src/utils/LocalizacaoUtils.js

/**
 * Converte graus para radianos.
 */
function toRad(value) {
    return (value * Math.PI) / 180;
}
  
/**
 * Calcula a distância entre dois pontos geográficos em metros usando a fórmula de Haversine.
 */
export function calcularDistanciaEmMetros(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c;
    return distancia;
}
  
/**
 * Valida se a distância entre professor e aluno está dentro do limite permitido.
 */
export function validarDistanciaProfessorAluno(latProf, lonProf, latAluno, lonAluno, limiteMetros = 500000) {
    const distancia = calcularDistanciaEmMetros(latProf, lonProf, latAluno, lonAluno);
    return distancia <= limiteMetros;
}
  