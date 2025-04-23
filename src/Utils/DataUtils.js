export function dataValida(data) {
    const date = new Date(data);
    return !isNaN(date.getTime());
}

export function dataFinalMaiorOuIgual(dataInicial, dataFinal) {
    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);
    return fim.getTime() >= inicio.getTime();
}