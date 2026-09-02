/**
 * Comportamento comum a todas as páginas (classe base do Page Object Model).
 */
export default class Page {
  private get menuPrincipal() {
    return $('#header .shop-menu');
  }

  private get botaoConsentimento() {
    return $('.fc-cta-consent');
  }

  /**
   * Abre um caminho relativo à baseUrl e deixa a página pronta para uso:
   * aguarda a eventual verificação anti-bot da aplicação, trata o diálogo de
   * consentimento de anúncios e só retorna com o menu principal renderizado.
   */
  async open(path: string = '/'): Promise<void> {
    await browser.url(path);
    await this.aguardarVerificacaoAntiBot();
    await this.fecharConsentimentoSePresente();
    await this.menuPrincipal.waitForDisplayed();
  }

  /**
   * A aplicação pública exibe uma tela intersticial de verificação
   * ("Please wait while your request is being verified...") para origens
   * consideradas suspeitas, como os IPs de datacenter dos runners de CI.
   * A tela se resolve sozinha e redireciona; aqui apenas aguardamos a
   * conclusão antes de interagir com a página.
   */
  private async aguardarVerificacaoAntiBot(): Promise<void> {
    await browser.waitUntil(
      async () => {
        if (await this.menuPrincipal.isExisting()) {
          return true;
        }
        const conteudo = await $('body')
          .getText()
          .catch(() => '');
        return !/being verified/i.test(conteudo) && (await this.menuPrincipal.isExisting());
      },
      {
        timeout: 90000,
        interval: 1000,
        timeoutMsg:
          'A aplicação não liberou o acesso após a verificação anti-bot (tela "request is being verified").',
      },
    );
  }

  private async fecharConsentimentoSePresente(): Promise<void> {
    try {
      await this.botaoConsentimento.waitForClickable({ timeout: 3000 });
      await this.botaoConsentimento.click();
    } catch {
      // Diálogo não exibido nesta região/execução: seguir normalmente.
    }
  }
}
