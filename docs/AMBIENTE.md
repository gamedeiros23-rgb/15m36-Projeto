# Ambiente de desenvolvimento na nuvem

O checkout existente em `/workspace/15m36-Projeto` é utilizado diretamente. As tarefas já são isoladas; não criar Git worktree sem pedido explícito.

Foram salvos no rascunho de configuração deste ambiente:

- `install_script`: `npm ci --cache /tmp/15m36-npm-cache --no-audit --no-fund` e `npm run build`, com diretório de trabalho explícito e interrupção em caso de erro.
- `start_skill`: execução do servidor, verificação, testes de produção e limites de conteúdo/publicação.

O salvamento não publica o ambiente nem o site. Para ativar a configuração reutilizável, revisar e salvar as alterações nas configurações e publicar o ambiente pelo produto. Isso é separado da publicação da aplicação. A prévia agora tem publicação própria em https://gamedeiros23-rgb.github.io/15m36-Projeto/; consulte `PUBLICACAO.md`.

Node.js 24 e Chromium `/usr/bin/chromium` foram usados nesta máquina. Em outra máquina, adaptar o caminho do navegador em `playwright.config.js` ou instalar o Chromium gerenciado pelo Playwright. Não é necessário configurar segredo de aplicação para desenvolver esta prévia.
