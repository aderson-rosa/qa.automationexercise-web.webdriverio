import { expect } from '@wdio/globals';
import homePage from '../pages/home.page';
import authPage from '../pages/auth.page';
import accountInfoPage from '../pages/accountInfo.page';
import accountStatusPage from '../pages/accountStatus.page';
import header from '../pages/components/header.component';
import { buildUsuario } from '../data/usuario.factory';

describe('Cadastro de usuário', () => {
  it('deve registrar um novo usuário e excluir a conta com sucesso', async () => {
    // Arrange: massa de dados única para esta execução
    const usuario = buildUsuario();

    // Act: iniciar o cadastro a partir da home (Signup / Login -> nome + e-mail -> Signup)
    await homePage.abrir();
    await homePage.irParaSignupLogin();
    await expect(authPage.tituloNewUserSignup).toHaveText('New User Signup!');
    await authPage.iniciarCadastro(usuario.nome, usuario.email);

    // Act: preencher o formulário completo da conta e criar
    await expect(accountInfoPage.inputSenha).toBeDisplayed();
    await accountInfoPage.preencherInformacoesDaConta(usuario);
    await accountInfoPage.preencherEndereco(usuario);
    await accountInfoPage.criarConta();

    // Assert: conta criada com sucesso
    await expect(accountStatusPage.tituloContaCriada).toHaveText('ACCOUNT CREATED!');

    // Act: continuar e validar a sessão autenticada no cabeçalho
    await accountStatusPage.continuar();
    await expect(header.mensagemLogadoComo).toHaveText(`Logged in as ${usuario.nome}`);

    // Act: excluir a conta recém-criada
    await header.excluirConta();

    // Assert: exclusão confirmada e botão Continue disponível
    await expect(accountStatusPage.tituloContaExcluida).toBeDisplayed();
    await expect(accountStatusPage.tituloContaExcluida).toHaveText('ACCOUNT DELETED!');
    await expect(accountStatusPage.botaoContinue).toBeDisplayed();
  });
});
