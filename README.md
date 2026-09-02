# qa.automationexercise-web.webdriverio

![CI](https://github.com/aderson-rosa/qa.automationexercise-web.webdriverio/actions/workflows/ci.yml/badge.svg)

📊 **[Relatório Allure da última execução](https://aderson-rosa.github.io/qa.automationexercise-web.webdriverio/)** (publicado automaticamente pela pipeline)

Testes E2E da aplicação **[Automation Exercise](https://automationexercise.com/)** com **[WebdriverIO](https://webdriver.io/)** (Mocha + TypeScript, sem Gherkin), **Page Object Model** e relatório **Allure**.

## ✅ Escopo automatizado

**Test Case 1 — Registrar um usuário** (suíte `cadastro`): fluxo completo de cadastro — Signup/Login, nome + e-mail, formulário da conta (título, senha, data de nascimento, newsletter, ofertas de parceiros, endereço completo), criação da conta, verificação de `ACCOUNT CREATED!`, sessão autenticada (`Logged in as`), exclusão da conta e verificação final de `ACCOUNT DELETED!` com o botão `Continue` visível.

## 🔧 Pré-requisitos

- **Node.js 20+** (LTS) e **npm**
- **Google Chrome** instalado (o WebdriverIO gerencia o driver automaticamente)
- **Java 8+** apenas para gerar/abrir o relatório Allure localmente (o Allure CLI roda sobre a JVM)

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

O relatório traz **evidências em todas as execuções, não apenas nas que falham**: o fluxo é capturado nos marcos de negócio (tela de signup, formulário preenchido, conta criada, usuário autenticado e conta excluída), o que comprova o caminho percorrido para quem audita o resultado sem rodar a suíte. Em caso de falha, além do screenshot do momento do erro, é anexado o contexto da página (URL e cabeçalho). Cada execução também registra o ambiente (URL base, navegador, modo headless e se rodou local ou no CI), e o caso de teste é classificado por funcionalidade e criticidade. Na pipeline, o relatório HTML é gerado e publicado como artefato de cada execução.

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
- **Estabilidade sem retry:** cada transição de página é sincronizada por uma espera explícita nos Page Objects (`aguardarContaCriada`, `aguardarSessaoAutenticada`, `aguardarContaExcluida`). Sem isso, a asserção seguinte é avaliada durante a navegação e falha por elemento inexistente — falha que não aparece em máquina rápida e surge no CI. A opção foi corrigir a sincronização na origem, e não mascarar com `retry`, que esconderia o problema real.
- **Versão do navegador:** `browserVersion: 'stable'` faz o WebdriverIO gerenciar o Chrome for Testing, garantindo navegador e driver na mesma versão no local e no CI (evita o erro clássico de incompatibilidade entre ChromeDriver e Chrome instalado).
- **Verificação anti-bot da aplicação:** ao executar a partir de IPs de datacenter (caso dos runners do GitHub Actions), a aplicação exibe uma tela intersticial "Please wait while your request is being verified...". O diagnóstico veio do próprio relatório da pipeline: o screenshot anexado no Allure mostrou essa tela em vez da home. A classe base aguarda a liberação antes de qualquer interação, e o timeout das esperas pós-navegação fica em `test/support/timeouts.ts`, já que a tela pode reaparecer a cada navegação.
- **Anúncios de terceiros bloqueados na rede:** a aplicação carrega anúncios do Google que em alguns ambientes abrem um modal sobre a página e interceptam cliques. Em vez de tentar fechar overlays de terceiros, os domínios são redirecionados para um endereço inválido via `--host-resolver-rules`, mantendo o teste focado na aplicação sob teste.
- **Diagnóstico de falha:** além do screenshot, o hook `afterTest` anexa ao Allure a URL e o conteúdo do cabeçalho no momento da falha. É esse contexto que permite distinguir um defeito da aplicação de um bloqueio do ambiente de execução.

## 🚀 Pipeline

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em todo push/PR: verifica os tipos, executa a suíte headless no Ubuntu e gera o relatório **Allure**, publicado de duas formas: como **artefato** da execução e, nas execuções da `main`, no **GitHub Pages**, em uma URL fixa que sempre reflete a última execução.
