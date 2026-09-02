import allureReporter from '@wdio/allure-reporter';

/**
 * Configuração do WebdriverIO.
 * Execução headless por padrão (local e CI); para acompanhar o navegador
 * durante a depuração, rode com HEADLESS=false.
 */
const headless = process.env.HEADLESS !== 'false';

// Redireciona os domínios de anúncios/pesquisas para um endereço inválido.
// A aplicação carrega anúncios do Google que, em alguns ambientes, abrem um
// modal sobre a página ("Answer questions to support great content") e
// interceptam cliques. Bloquear no nível da rede mantém o teste focado na
// aplicação, sem depender de fechar overlays de terceiros.
const dominiosDeAnuncios = [
  '*.googlesyndication.com',
  '*.doubleclick.net',
  '*.googletagservices.com',
  '*.google-analytics.com',
  '*.adtrafficquality.google',
  '*.fundingchoicesmessages.google.com',
  'surveys.google.com',
];

const chromeArgs = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-notifications',
  '--window-size=1366,900',
  `--host-resolver-rules=${dominiosDeAnuncios.map((d) => `MAP ${d} 127.0.0.1`).join(',')}`,
];
if (headless) {
  chromeArgs.push('--headless=new');
}

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: ['./test/specs/**/*.e2e.ts'],
  suites: {
    cadastro: ['./test/specs/cadastroUsuario.e2e.ts'],
  },

  maxInstances: 5,
  capabilities: [
    {
      browserName: 'chrome',
      // Chrome for Testing gerenciado pelo próprio WebdriverIO: garante que o
      // navegador e o driver tenham SEMPRE a mesma versão, no local e no CI.
      browserVersion: 'stable',
      'goog:chromeOptions': { args: chromeArgs },
    },
  ],

  logLevel: 'warn',
  baseUrl: 'https://automationexercise.com',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000,
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  /**
   * Em caso de falha, anexa ao relatório Allure um screenshot e o contexto da
   * página (URL e conteúdo do cabeçalho). Esse contexto é o que permite
   * diferenciar uma falha da aplicação de um bloqueio do ambiente de execução.
   */
  afterTest: async function (_test, _context, { passed }) {
    if (passed) {
      return;
    }

    await browser.takeScreenshot();

    const url = await browser.getUrl().catch(() => 'indisponível');
    const cabecalho = await $('#header')
      .getText()
      .then((texto) => texto.replace(/\s+/g, ' '))
      .catch(() => 'indisponível');

    allureReporter.addAttachment(
      'Contexto da falha',
      `URL: ${url}\nCabeçalho: ${cabecalho}`,
      'text/plain',
    );
  },
};
