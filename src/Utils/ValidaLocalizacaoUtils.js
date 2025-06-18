function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Raio da Terra em metros
  const toRad = deg => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function identificarAlunosDistantes(presencas, raioPermitido = 20) {
  if (!presencas || presencas.length === 0) return [];

  // Filtra apenas os alunos com latitude e longitude válidas
  const validos = presencas.filter(p =>
    typeof p.latitude === 'number' &&
    typeof p.longitude === 'number' &&
    p.latitude !== 0 &&
    p.longitude !== 0
  );

  if (validos.length === 0) return [];

  // Cálculo do ponto central (média das localizações válidas)
  const centro = validos.reduce(
    (acc, p) => {
      acc.lat += p.latitude;
      acc.lon += p.longitude;
      return acc;
    },
    { lat: 0, lon: 0 }
  );

  centro.lat /= validos.length;
  centro.lon /= validos.length;

  // Verifica quem está fora do raio permitido
  const alunosDistantes = [];

  for (const p of validos) {
    const distancia = calcularDistancia(
      centro.lat,
      centro.lon,
      p.latitude,
      p.longitude
    );
    if (distancia > raioPermitido) {
      alunosDistantes.push({
        id_aluno: p.id_aluno,
        aluno: p.aluno,
        distancia: Number(distancia.toFixed(2)),
        local_aluno: {
          latitude: p.latitude,
          longitude: p.longitude
        },
        centro_estimado: {
          latitude: Number(centro.lat.toFixed(8)),
          longitude: Number(centro.lon.toFixed(8))
        }
      });
    }
  }

  return alunosDistantes;
}
