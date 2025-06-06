export function validarEmail(email) {

    // Expressão regular simples para validação de email.
    // Verifica se o email possui caracteres válidos, 
    // Um "@" e um domínio com pelo menos um ponto.

    const formatacao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formatacao.test(email);
}