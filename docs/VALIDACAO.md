# Validação executada

## Resultado final

`npm ci --cache /tmp/15m36-npm-cache --no-audit --no-fund` completou com o lockfile existente. `npm test` compilou o build de produção com Vite, iniciou o servidor de preview e executou Playwright com Chromium real, em um único worker.

**Execução final da atualização por vídeo: 19 testes aprovados; 1 ignorado intencionalmente.** O teste exclusivo do menu móvel não se aplica ao projeto desktop. Nenhuma falha permaneceu na execução final. A execução móvel usa emulação de viewport/toque, não um aparelho físico.

Resoluções: 1440 × 1000 no desktop e 390 × 844 no celular. As capturas de página inteira ficam em `artifacts/`, incluindo início, treino, alimentação, hidratação, módulos e calendário nas duas larguras; também há captura do menu móvel.

## Cobertura

- Abertura das telas, seis orientações introdutórias, apresentação do bônus e encerramento; cinco módulos na ordem e nove treinos, três por fase.
- Links do menu, cartões de módulos, três pilares, botão principal, calendário e Comece aqui.
- Navegação de treino anterior, seguinte e retorno ao módulo.
- Conclusão e reversão dos treinos; atualização da página; próximo treino; conclusão dos nove sem comprovar 21 dias.
- Leitura de aula com persistência separada e reversão.
- Meta pessoal de água, registros, correção, exclusão, rejeição de valor negativo e persistência.
- Mudança simulada para o dia seguinte com preservação da meta e novo contador diário.
- Calendário com 21 dias e nove posições demonstrativas de treino; aviso de programação demonstrativa.
- Explorador interativo: seleção de dia, controles anterior/seguinte, fase correspondente, treino ou recuperação, acesso ao treino e encerramento sem registro automático.
- Cinco capas verticais e progresso da apresentação do bônus separado dos treinos.
- HTML com recursos incorporados: navegação, persistência e ausência de solicitações de recursos HTTP adicionais.
- Alimentação vazia; ausência de vídeo real, play fictício e download inexistente.
- Menu móvel: abertura, seleção de tela, botão de fechar, fundo, Escape e contenção do foco.
- Link para pular conteúdo e foco por teclado.
- Ausência de excesso de largura em todas as rotas verificadas.
- Ausência de erros JavaScript nas rotas verificadas.
- Auditoria axe-core com regras WCAG A/AA em início, treinos, módulos, treino individual, alimentação, hidratação, calendário e orientação EVO3: nenhuma violação detectada. Auditoria automática não equivale a certificação completa de acessibilidade.

## Não verificado / indisponível

- Reprodução de vídeo, downloads e conteúdo de receitas: materiais reais não fornecidos.
- Filtros/fichas com receitas reais: estrutura implementada, array vazio; nenhum conteúdo fictício foi incluído para a entrega.
- Login, pagamento, direitos comerciais e Hotmart: fora do escopo desta prévia.
- Sincronização, conta e recuperação em outro dispositivo: não implementadas; persistência é local.
- Dispositivos físicos, Safari e Firefox: não testados.
- A publicação foi concluída no GitHub Pages. Verificar as evidências e a limitação dos testes remotos na seção abaixo.

## Revisão visual

As capturas de início desktop e móvel foram inspecionadas visualmente. Os demais estados têm capturas geradas e verificações de layout automatizadas. Não há fotografia do Gabriel, promessa de resultado, receita inventada ou programação demonstrativa apresentada como definitiva.

## Limitação da prévia HTML portátil

A abertura direta de `file://` foi tentada nas duas larguras e bloqueada pela política administrativa do Chromium deste ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`). Essa restrição não foi desativada. A aplicação HTML incorporada é testada via HTTP, verificando navegação, persistência e ausência de solicitações adicionais de scripts, fontes ou estilos. A abertura por arquivo em outros navegadores não foi validada aqui.

## Publicação GitHub Pages

URL: https://gamedeiros23-rgb.github.io/15m36-Projeto/

O GitHub Pages confirmou status `built`, acesso público e HTTPS obrigatório para a branch `gh-pages`. O endereço respondeu HTTP 200 sem autenticação. Os 16 arquivos públicos foram conferidos com curl mantendo a verificação TLS; todos os SHA-256 coincidiram com o build local.

Dois testes remotos de Playwright (desktop e celular) foram tentados e falharam antes de abrir a página com `ERR_CERT_AUTHORITY_INVALID`, causado pela confiança HTTPS do navegador neste ambiente com proxy. Importar a CA já fornecida pelo ambiente para NSS não resolveu a falha. Não foram usados `ignoreHTTPSErrors` ou outras formas de desativar a validação TLS. Assim, os testes de interações diretamente na publicação não são considerados aprovados. O código servido publicamente corresponde ao build local já validado.
