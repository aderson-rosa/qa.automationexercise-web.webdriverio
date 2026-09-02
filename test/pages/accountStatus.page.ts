import Page from './page';
import { TIMEOUT_NAVEGACAO } from '../support/timeouts';

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

  /** Aguarda a confirmação de conta criada ficar visível após o envio do formulário. */
  async aguardarContaCriada(): Promise<void> {
    await this.tituloContaCriada.waitForDisplayed({ timeout: TIMEOUT_NAVEGACAO });
  }

  /** Aguarda a confirmação de conta excluída ficar visível após a exclusão. */
  async aguardarContaExcluida(): Promise<void> {
    await this.tituloContaExcluida.waitForDisplayed({ timeout: TIMEOUT_NAVEGACAO });
  }

  /** Prossegue a navegação a partir da tela de confirmação. */
  async continuar(): Promise<void> {
    await this.botaoContinue.click();
  }
}

export default new AccountStatusPage();
