/**
 * Recebe um cpf apenas com números retorna
 * um cpf formatado no padrão ###.###.###-##
 * @param {*} cpf - cpf usado para a geração
 */
export const formatarCpf = (cpf = '') => {
  if (cpf.length !== 11) {
    throw new Error('CPF inválido.');
  }

  cpfComMascara = [];

  for (let i = 0; i < cpf.length; i++) {
    if (i === 2 || i === 5) {
      cpfComMascara.push(`${cpf[i]}.`);
    } else if (i === 8) {
      cpfComMascara.push(`${cpf[i]}-`);
    } else {
      cpfComMascara.push(cpf[i]);
    }
  }

  return String(cpfComMascara.join(''));
};