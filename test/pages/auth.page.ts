import Page from './page';

/**
 * Tela de Signup / Login: início do cadastro de um novo usuário.
 * Mapeamento prioriza os atributos data-qa expostos pela aplicação.
 */
class AuthPage extends Page {
  get tituloNewUserSignup() {
    return $('.signup-form h2');
  }

  get inputNome() {
    return $('[data-qa="signup-name"]');
  }

  get inputEmail() {
    return $('[data-qa="signup-email"]');
  }

  get botaoSignup() {
    return $('[data-qa="signup-button"]');
  }

  /** Inicia o cadastro informando nome e e-mail e avançando para o formulário completo. */
  async iniciarCadastro(nome: string, email: string): Promise<void> {
    await this.inputNome.setValue(nome);
    await this.inputEmail.setValue(email);
    await this.botaoSignup.click();
  }
}

export default new AuthPage();
