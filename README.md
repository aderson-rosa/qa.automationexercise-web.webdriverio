# qa.automationexercise-web.webdriverio

![CI](https://github.com/aderson-rosa/qa.automationexercise-web.webdriverio/actions/workflows/ci.yml/badge.svg)

Testes E2E da aplicação **[Automation Exercise](https://automationexercise.com/)** com **[WebdriverIO](https://webdriver.io/)** (Mocha + TypeScript, sem Gherkin), **Page Object Model** e relatório **Allure**.

## ✅ Escopo automatizado

**Test Case 1 — Registrar um usuário** (suíte `cadastro`): fluxo completo de cadastro — Signup/Login, nome + e-mail, formulário da conta (título, senha, data de nascimento, newsletter, ofertas de parceiros, endereço completo), criação da conta, verificação de `ACCOUNT CREATED!`, sessão autenticada (`Logged in as`), exclusão da conta e verificação final de `ACCOUNT DELETED!` com o botão `Continue` visível.

## 🔧 Pré-requisitos

- **Node.js 20+** (LTS) e **npm**
- **Google Chrome** instalado (o WebdriverIO gerencia o driver automaticamente)
- **Java 11+** apenas para abrir o relatório Allure localmente (`allure-commandline`)

## ▶️ Instalação e execução

```bash
npm install
npm test                 # todas as suítes, headless (padrão)
npm run test:cadastro    # apenas a suíte de cadastro
```

Os testes rodam **headless por padrão** (local e CI). Para acompanhar o navegador durante a depuração:

```bash
HEADLESS=false npm test
```

No Windows (PowerShell): `$env:HEADLESS='false'; npm test`

## 📊 Relatório Allure

Cada execução grava os resultados em `allure-results/`. Para gerar e abrir o relatório:

```bash
npm run report:allure
```

Em caso de falha, um screenshot do momento do erro é anexado automaticamente ao relatório. Na pipeline, o relatório HTML é gerado e publicado como artefato de cada execução.

## 🗂️ Estrutura e padrões

```
├── test
│   ├── data/usuario.factory.ts     # massa de dados única por execução (Faker)
│   ├── pages/                      # Page Objects (uma classe por página)
│   │   ├── page.ts                 # base: navegação + tratamento de consentimento
│   │   ├── home.page.ts
│   │   ├── auth.page.ts            # tela de Signup / Login
│   │   ├── accountInfo.page.ts     # formulário "Enter Account Information"
│   │   ├── accountStatus.page.ts   # telas ACCOUNT CREATED! / ACCOUNT DELETED!
│   │   └── components/header.component.ts  # cabeçalho pós-login (compartilhado)
│   └── specs/cadastroUsuario.e2e.ts
└── wdio.conf.ts                    # headless, suítes, Allure, screenshot em falha
```

Decisões que sustentam o crescimento do projeto sem duplicação:

- **Page Object Model:** seletores e ações encapsulados por página; os testes descrevem o fluxo de negócio. Uma mudança de layout é corrigida em um único lugar.
- **Componentes compartilhados:** o cabeçalho pós-login vive em `components/`, fora das páginas, porque aparece em todas elas.
- **Mapeamento de elementos:** prioridade para os atributos **`data-qa`** expostos pela aplicação (estáveis por contrato); ids e âncoras semânticas como segunda opção; XPath apenas onde não há alternativa.
- **Factory de dados:** e-mail único por execução (timestamp + aleatório) permite reexecuções ilimitadas sem colisão de contas.
- **Triple A:** o teste segue Arrange / Act / Assert com marcação explícita das fases.
- **Resiliência:** o diálogo de consentimento de anúncios (exibido em algumas regiões) é tratado na classe base, sem poluir os testes.

## 🚀 Pipeline

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em todo push/PR: executa a suíte headless no Ubuntu, gera o relatório Allure e o publica como artefato da execução.
