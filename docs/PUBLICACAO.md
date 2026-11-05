# Publicação e atualização da mesma prévia

## Site deste projeto

- URL HTTPS: https://gamedeiros23-rgb.github.io/15m36-Projeto/
- Provedor: GitHub Pages.
- Identificador: `gamedeiros23-rgb/15m36-Projeto`.
- Branch publicada: `gh-pages`.
- Diretório: `/`.
- Acesso: público, sem login, com HTTPS obrigatório.
- Configuração persistente: `deploy/github-pages.json`.

Esta publicação pertence ao novo repositório. Não utiliza nem modifica um site anterior. A publicação do ambiente Codex é independente da implantação do site.

## Atualizar o mesmo endereço

1. Fazer a alteração no código e executar as verificações pertinentes, incluindo `npm test`.
2. Executar `npm run deploy` no diretório deste projeto. O comando recompila, gera a versão HTML incorporada, envia o build à **mesma branch `gh-pages`**, acompanha o build do commit enviado e verifica a resposta pública.
3. Executar `PUBLIC_PREVIEW_URL=https://gamedeiros23-rgb.github.io/15m36-Projeto/ npm run test:published` para testar a aplicação publicada, em contextos sem login, nas larguras de 1440 px e 390 px.
4. Salvar as mudanças de código e documentação na branch `main` do repositório, preservando o histórico remoto. Não criar outro site, repositório ou URL a cada atualização.

O script utiliza um index Git temporário fora do checkout para criar a árvore do build. Ele não troca a branch de trabalho nem substitui o index principal. Não usa force push e preserva o histórico da branch de publicação.

`npm run deploy:branch` recompila e envia somente a branch, sem afirmar que o acesso público já foi atualizado. Depois de utilizá-lo, conferir o status do GitHub Pages e abrir a URL existente. A publicação por branch do GitHub Pages foi observada compilando após o envio da branch. Atualizar apenas `main` não executa o comando de deploy: não há workflow de aplicação configurado para isso.

Se a integração não puder consultar ou configurar Pages, o responsável pode conferir a origem em https://github.com/gamedeiros23-rgb/15m36-Projeto/settings/pages. A origem existente deve continuar **Deploy from a branch → gh-pages → /(root)**. Não trocar o site para outra origem sem necessidade.

## Verificação

O GitHub confirmou o build `ab442395f1023f53fc572ba0ed0f06ab708013f0` como `built`, a URL como pública e HTTPS obrigatório. O endpoint respondeu HTTP 200 sem autenticação. Foram baixados os 16 arquivos públicos do build por curl com verificação TLS ativa; os hashes SHA-256 coincidiram com os arquivos locais, incluindo HTML, JavaScript, CSS, fontes e HTML incorporado.

Os dois testes remotos de navegador foram tentados e não concluíram: o Chromium deste ambiente retornou `ERR_CERT_AUTHORITY_INVALID` para o certificado do proxy. A CA de proxy fornecida pelo próprio ambiente foi importada no armazenamento NSS, mas a nova tentativa ainda falhou. Não foi desativada a verificação TLS. Não há capturas nem resultados aprovados de interação direta no site público. A versão equivalente teve 19 testes locais aprovados e um ignorado intencionalmente, em desktop e celular, conforme `docs/VALIDACAO.md`. O teste remoto permanece disponível para um ambiente com confiança HTTPS compatível.

## Conteúdo e acesso

Somente o build estático é publicado. A árvore remota contém HTML, assets e `.nojekyll`, sem senhas, tokens, .env ou gravação de referência. O cardápio de quatro refeições e o e-book com 40 receitas foram fornecidos e agora integram a publicação, com downloads reais e fichas navegáveis. Vídeos, exercícios específicos e roteiro alimentar diário de 21 dias continuam em preparação.

Esta prévia não autentica compradores nem integra a Hotmart. Os registros ficam apenas no navegador, sem sincronização entre dispositivos. Os registros da versão local/HTML não migram automaticamente para a origem pública.
