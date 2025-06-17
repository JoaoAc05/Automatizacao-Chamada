export function validarDiferencaDeTempo(serverTime, postTime) {
    // (SEGUNDOS SERVIDOR - SEGUNDOS POST) + 60 * (MINUTOS SERVIDOR - MINUTOS POST)
    
    //EX: Horário Servidor = 13:01:58
    // Horário Post = 13:02:02
    // Segundos - Segundos ( 58 - 2 = 56)
    // Minutos  - Minutos ( 1 - 2 = -1)
    // Minutos Res * 60 ( -1 * 60 = -60)
    // Segundos Res + Minutos Res ( 56 + (-60) = -4)
    // RESULTADO = 4 segundos de diferenca

    const segundos = serverTime.getUTCSeconds() - postTime.getUTCSeconds();
    const minutos = serverTime.getUTCMinutes() - postTime.getUTCMinutes();
    const diferencaSegundos = Math.abs(segundos + 60 * minutos);

    return diferencaSegundos <= 50;

}
  