/**
 * Timeout das esperas que ocorrem logo após uma navegação.
 *
 * A aplicação pode reexibir a tela intersticial de verificação
 * ("Please wait while your request is being verified...") a cada navegação
 * quando a origem é um IP de datacenter, como nos runners de CI. Nesses casos
 * o carregamento leva bem mais que o `waitforTimeout` padrão, por isso as
 * esperas pós-navegação usam este valor maior, definido em um único lugar.
 */
export const TIMEOUT_NAVEGACAO = 90000;
