import { faker } from '@faker-js/faker';

export interface UsuarioCadastro {
  nome: string;
  email: string;
  senha: string;
  diaNascimento: string;
  mesNascimento: string;
  anoNascimento: string;
  primeiroNome: string;
  sobrenome: string;
  empresa: string;
  endereco: string;
  endereco2: string;
  pais: string;
  estado: string;
  cidade: string;
  cep: string;
  celular: string;
}

/**
 * Gera a massa completa do cadastro com e-mail único por execução
 * (timestamp + aleatório), permitindo reexecuções ilimitadas sem colisão
 * com contas já existentes na aplicação.
 */
export function buildUsuario(): UsuarioCadastro {
  const primeiroNome = faker.person.firstName();
  const sobrenome = faker.person.lastName();

  return {
    nome: `${primeiroNome} ${sobrenome}`,
    email: `qa.${Date.now()}.${faker.string.alphanumeric(6).toLowerCase()}@zigtest.com.br`,
    senha: faker.internet.password({ length: 12 }),
    diaNascimento: '10',
    mesNascimento: 'May',
    anoNascimento: '1990',
    primeiroNome,
    sobrenome,
    empresa: faker.company.name(),
    endereco: faker.location.streetAddress(),
    endereco2: faker.location.secondaryAddress(),
    pais: 'Canada',
    estado: faker.location.state(),
    cidade: faker.location.city(),
    cep: faker.location.zipCode(),
    celular: faker.phone.number({ style: 'international' }),
  };
}
