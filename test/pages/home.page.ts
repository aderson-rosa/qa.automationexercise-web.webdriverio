import Page from './page';

/**
 * Página inicial do Automation Exercise.
 */
class HomePage extends Page {
  get linkSignupLogin() {
    return $('a[href="/login"]');
  }

  /** Abre a página inicial do site. */
  async abrir(): Promise<void> {
    await super.open('/');
  }

  /** Navega para a tela de Signup / Login pelo menu principal. */
  async irParaSignupLogin(): Promise<void> {
    await this.linkSignupLogin.click();
  }
}

export default new HomePage();
