import { TIMEOUT_NAVEGACAO } from '../../support/timeouts';

/**
 * Cabeçalho exibido em todas as páginas após o login.
 * Componente separado das páginas porque é compartilhado por todas elas.
 */
class HeaderComponent {
  // Seletor por texto parcial do WebdriverIO: o elemento é uma âncora sem href
  // nem classe própria, então o texto é o identificador estável disponível.
  get mensagemLogadoComo() {
    return $('a*=Logged in as');
  }

  get linkDeleteAccount() {
    return $('a[href="/delete_account"]');
  }

  /**
   * Aguarda o cabeçalho da sessão autenticada ficar visível.
   * Necessário porque a confirmação de cadastro navega para a home: sem esta
   * espera, a asserção seguinte é avaliada durante a navegação e falha por
   * elemento inexistente, especialmente em ambientes de CI mais lentos.
   */
  async aguardarSessaoAutenticada(): Promise<void> {
    await this.mensagemLogadoComo.waitForDisplayed({ timeout: TIMEOUT_NAVEGACAO });
  }

  /** Aciona a exclusão da conta do usuário autenticado. */
  async excluirConta(): Promise<void> {
    await this.linkDeleteAccount.click();
  }
}

export default new HeaderComponent();
