/**
 * Comportamento comum a todas as páginas (classe base do Page Object Model).
 */
export default class Page {
  /**
   * Abre um caminho relativo à baseUrl e trata o diálogo de consentimento
   * de anúncios, que o site exibe em algumas regiões e bloqueia a interação.
   */
  async open(path: string = '/'): Promise<void> {
    await browser.url(path);
    await this.fecharConsentimentoSePresente();
  }

  private async fecharConsentimentoSePresente(): Promise<void> {
    const botaoConsentimento = $('.fc-cta-consent');
    try {
      await botaoConsentimento.waitForClickable({ timeout: 3000 });
      await botaoConsentimento.click();
    } catch {
      // Diálogo não exibido nesta região/execução: seguir normalmente.
    }
  }
}
