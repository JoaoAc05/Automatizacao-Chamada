// Remover caracteres do cpf
export function limparCPF(cpf) {
  if (!cpf) {
    throw new Error('CPF não fornecido');
  }
    return cpf.replace(/[^\d]+/g, '');
}

// Verificar se é um CPF válido
export function validarCPF(cpf) {
    cpf = limparCPF(cpf);
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }

  export function formatarCPF(cpf) {
    cpf = limparCPF(cpf);
    if (cpf.length !== 11) return cpf;
    return `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}-${cpf.substr(9, 2)}`;
  }