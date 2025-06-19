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

function encontrarCentroPorModaGeografica(alunos, raioAgrupamento = 30) {
  let melhorPonto = null;
  let maxVizinhos = -1;

  for (const base of alunos) {
    let vizinhos = 0;

    for (const outro of alunos) {
      if (base !== outro) {
        const distancia = calcularDistancia(base.latitude, base.longitude, outro.latitude, outro.longitude);
        if (distancia <= raioAgrupamento) {
          vizinhos++;
        }
      }
    }

    if (vizinhos > maxVizinhos) {
      maxVizinhos = vizinhos;
      melhorPonto = base;
    }
  }

  return {
    lat: melhorPonto.latitude,
    lon: melhorPonto.longitude
  };
}

export function identificarAlunosDistantes(presencas, raioPermitido = 30) {
  if (!presencas || presencas.length === 0) return [];

  // Filtra os com localização válida
  const validos = presencas.filter(p =>
    typeof p.latitude === 'number' &&
    typeof p.longitude === 'number' &&
    p.latitude !== 0 &&
    p.longitude !== 0
  );

  // Filtra os com localização inválida (para serem marcados como distantes)
  const invalidos = presencas.filter(p =>
    typeof p.latitude !== 'number' ||
    typeof p.longitude !== 'number' ||
    p.latitude === 0 ||
    p.longitude === 0
  );

  if (validos.length === 0 || validos.length < 7) {
    // Todos são considerados próximos (exceto os inválidos, que são sempre distantes)
    return invalidos.map(p => ({
      id_aluno: p.id_aluno,
      aluno: p.aluno,
      distancia: null,
      local_aluno: {
        latitude: p.latitude,
        longitude: p.longitude
      },
      centro_estimado: null
    }));
  }

  // Encontra o ponto de maior concentração (moda geográfica)
  const centro = encontrarCentroPorModaGeografica(validos, raioPermitido);

  // Verifica quem está fora do raio a partir do centro de concentração
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

  // Adiciona os inválidos como distantes
  for (const p of invalidos) {
    alunosDistantes.push({
      id_aluno: p.id_aluno,
      aluno: p.aluno,
      distancia: null,
      local_aluno: {
        latitude: p.latitude,
        longitude: p.longitude
      },
      centro_estimado: null
    });
  }

  return alunosDistantes;
}
