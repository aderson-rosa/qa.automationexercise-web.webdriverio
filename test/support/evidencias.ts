import allureReporter from '@wdio/allure-reporter';

/**
 * Anexa ao relatório Allure um screenshot nomeado do estado atual da página.
 *
 * As evidências são capturadas nos marcos de negócio do fluxo, e não apenas
 * quando há falha: em uma execução bem-sucedida o relatório mostra o caminho
 * percorrido, o que serve como comprovação do teste para quem audita o
 * resultado sem executar a suíte.
 */
export async function anexarEvidencia(nome: string): Promise<void> {
  const screenshot = await browser.takeScreenshot();
  allureReporter.addAttachment(nome, Buffer.from(screenshot, 'base64'), 'image/png');
}
