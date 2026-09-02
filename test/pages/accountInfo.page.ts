import Page from './page';
import type { UsuarioCadastro } from '../data/usuario.factory';

/**
 * Formulário "Enter Account Information": dados da conta e endereço.
 * Mapeamento prioriza os atributos data-qa expostos pela aplicação.
 */
class AccountInfoPage extends Page {
  get titulo() {
    return $('.login-form h2 b');
  }

  get radioTituloMr() {
    return $('#id_gender1');
  }

  get inputSenha() {
    return $('[data-qa="password"]');
  }

  get selectDia() {
    return $('[data-qa="days"]');
  }

  get selectMes() {
    return $('[data-qa="months"]');
  }

  get selectAno() {
    return $('[data-qa="years"]');
  }

  get checkboxNewsletter() {
    return $('#newsletter');
  }

  get checkboxOfertasParceiros() {
    return $('#optin');
  }

  get inputPrimeiroNome() {
    return $('[data-qa="first_name"]');
  }

  get inputSobrenome() {
    return $('[data-qa="last_name"]');
  }

  get inputEmpresa() {
    return $('[data-qa="company"]');
  }

  get inputEndereco() {
    return $('[data-qa="address"]');
  }

  get inputEndereco2() {
    return $('[data-qa="address2"]');
  }

  get selectPais() {
    return $('[data-qa="country"]');
  }

  get inputEstado() {
    return $('[data-qa="state"]');
  }

  get inputCidade() {
    return $('[data-qa="city"]');
  }

  get inputCep() {
    return $('[data-qa="zipcode"]');
  }

  get inputCelular() {
    return $('[data-qa="mobile_number"]');
  }

  get botaoCriarConta() {
    return $('[data-qa="create-account"]');
  }

  /** Preenche título, senha e data de nascimento e marca as duas opções de comunicação. */
  async preencherInformacoesDaConta(usuario: UsuarioCadastro): Promise<void> {
    await this.radioTituloMr.click();
    await this.inputSenha.setValue(usuario.senha);
    await this.selectDia.selectByAttribute('value', usuario.diaNascimento);
    await this.selectMes.selectByVisibleText(usuario.mesNascimento);
    await this.selectAno.selectByAttribute('value', usuario.anoNascimento);
    await this.checkboxNewsletter.click();
    await this.checkboxOfertasParceiros.click();
  }

  /** Preenche o bloco de endereço e contato do formulário. */
  async preencherEndereco(usuario: UsuarioCadastro): Promise<void> {
    await this.inputPrimeiroNome.setValue(usuario.primeiroNome);
    await this.inputSobrenome.setValue(usuario.sobrenome);
    await this.inputEmpresa.setValue(usuario.empresa);
    await this.inputEndereco.setValue(usuario.endereco);
    await this.inputEndereco2.setValue(usuario.endereco2);
    await this.selectPais.selectByVisibleText(usuario.pais);
    await this.inputEstado.setValue(usuario.estado);
    await this.inputCidade.setValue(usuario.cidade);
    await this.inputCep.setValue(usuario.cep);
    await this.inputCelular.setValue(usuario.celular);
  }

  /** Submete o formulário de criação da conta. */
  async criarConta(): Promise<void> {
    await this.botaoCriarConta.click();
  }
}

export default new AccountInfoPage();
