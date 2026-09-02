/**
 * Cabeçalho exibido em todas as páginas após o login.
 * Componente separado das páginas porque é compartilhado por todas elas.
 */
class HeaderComponent {
  get mensagemLogadoComo() {
    return $('//header//a[contains(., "Logged in as")]');
  }

  get linkDeleteAccount() {
    return $('a[href="/delete_account"]');
  }

  /** Aciona a exclusão da conta do usuário autenticado. */
  async excluirConta(): Promise<void> {
    await this.linkDeleteAccount.click();
  }
}

export default new HeaderComponent();
