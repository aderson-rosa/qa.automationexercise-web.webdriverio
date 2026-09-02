import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import homePage from '../pages/home.page';
import authPage from '../pages/auth.page';
import accountInfoPage from '../pages/accountInfo.page';
import accountStatusPage from '../pages/accountStatus.page';
import header from '../pages/components/header.component';
import { buildUsuario } from '../data/usuario.factory';
import { anexarEvidencia } from '../support/evidencias';

describe('Cadastro de usuário', () => {
  it('deve registrar um novo usuário e excluir a conta com sucesso', async () => {
    // Classificação do caso no relatório Allure (funcionalidade e criticidade).
    allureReporter.addFeature('Cadastro de usuário');
    allureReporter.addStory('Test Case 1: registrar um usuário');
    allureReporter.addSeverity('critical');

    // Arrange: massa de dados única para esta execução
    const usuario = buildUsuario();

    // Act: iniciar o cadastro a partir da home (Signup / Login -> nome + e-mail -> Signup)
    await homePage.abrir();
    await homePage.irParaSignupLogin();
    await expect(authPage.tituloNewUserSignup).toHaveText('New User Signup!');
    await anexarEvidencia('1. Tela de Signup / Login');
    await authPage.iniciarCadastro(usuario.nome, usuario.email);

    // Act: preencher o formulário completo da conta e criar
    await expect(accountInfoPage.inputSenha).toBeDisplayed();
    await accountInfoPage.preencherInformacoesDaConta(usuario);
    await accountInfoPage.preencherEndereco(usuario);
    await anexarEvidencia('2. Formulário de cadastro preenchido');
    await accountInfoPage.criarConta();

    // Assert: conta criada com sucesso
    await accountStatusPage.aguardarContaCriada();
    await expect(accountStatusPage.tituloContaCriada).toHaveText('ACCOUNT CREATED!');
    await anexarEvidencia('3. Conta criada');

    // Act: continuar e validar a sessão autenticada no cabeçalho
    await accountStatusPage.continuar();
    await header.aguardarSessaoAutenticada();
    await expect(header.mensagemLogadoComo).toHaveText(`Logged in as ${usuario.nome}`);
    await anexarEvidencia('4. Usuário autenticado');

    // Act: excluir a conta recém-criada
    await header.excluirConta();

    // Assert: exclusão confirmada e botão Continue disponível
    await accountStatusPage.aguardarContaExcluida();
    await expect(accountStatusPage.tituloContaExcluida).toHaveText('ACCOUNT DELETED!');
    await expect(accountStatusPage.botaoContinue).toBeDisplayed();
    await anexarEvidencia('5. Conta excluída');
  });
});
