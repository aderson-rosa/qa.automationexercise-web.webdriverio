import Page from './page';

/**
 * Telas de confirmação de conta (ACCOUNT CREATED! e ACCOUNT DELETED!),
 * que compartilham a mesma estrutura e o botão Continue.
 */
class AccountStatusPage extends Page {
  get tituloContaCriada() {
    return $('[data-qa="account-created"]');
  }

  get tituloContaExcluida() {
    return $('[data-qa="account-deleted"]');
  }

  get botaoContinue() {
    return $('[data-qa="continue-button"]');
  }

  /** Prossegue a navegação a partir da tela de confirmação. */
  async continuar(): Promise<void> {
    await this.botaoContinue.click();
  }
}

export default new AccountStatusPage();
