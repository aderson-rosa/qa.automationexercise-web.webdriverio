/**
 * Configuração do WebdriverIO.
 * Execução headless por padrão (local e CI); para acompanhar o navegador
 * durante a depuração, rode com HEADLESS=false.
 */
const headless = process.env.HEADLESS !== 'false';

const chromeArgs = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-notifications',
  '--window-size=1366,900',
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
   * Anexa um screenshot ao relatório Allure sempre que um teste falha,
   * facilitando a análise da falha direto no relatório.
   */
  afterTest: async function (_test, _context, { passed }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};
