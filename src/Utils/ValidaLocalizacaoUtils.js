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

  // Cálculo do ponto central (média das localizações)
  const centro = presencas.reduce(
    (acc, p) => {
      acc.lat += p.latitude;
      acc.lon += p.longitude;
      return acc;
    },
    { lat: 0, lon: 0 }
  );

  centro.lat /= presencas.length;
  centro.lon /= presencas.length;

  const alunosDistantes = presencas.filter(presenca => {
    const distancia = calcularDistancia(
      centro.lat,
      centro.lon,
      presenca.latitude,
      presenca.longitude
    );
    return distancia > raioPermitido;
  }).map(presenca => {
    const distancia = calcularDistancia(
      centro.lat,
      centro.lon,
      presenca.latitude,
      presenca.longitude
    );
    return {
      id_aluno: presenca.id_aluno,
      aluno: presenca.aluno,
      distancia: Number(distancia.toFixed(2)),
      local_aluno: {
        latitude: presenca.latitude,
        longitude: presenca.longitude
      },
      centro_estimado: {
        latitude: Number(centro.lat.toFixed(8)),
        longitude: Number(centro.lon.toFixed(8))
      }
    };
  });

  return alunosDistantes;
}
