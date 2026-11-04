# Desafio 15M36 — Método Gabriel Medeiros

Prévia funcional e independente da área de membros do TEAM MEDEIROS, atualizada com as capas verticais e a navegação do vídeo de referência. React + Vite, sem backend, autenticação, pagamentos ou integração com a Hotmart. Não altera nem depende de nenhum site anterior.

## Executar

Requer Node.js 22 ou 24 e npm. No diretório deste repositório:

```sh
npm ci --cache /tmp/15m36-npm-cache
npm run dev -- --port 4173 --strictPort
```

A URL local serve apenas para desenvolvimento; não é um endereço compartilhável pelo WhatsApp.

```sh
npm run build
npm run preview -- --port 4173 --strictPort
npm test
```

`dist/` contém o site estático. O build também gera `dist/15m36.html`, uma versão com JavaScript, CSS e fontes incorporados, para baixar e avaliar em um navegador que permita abrir arquivos HTML locais. O navegador gerenciado deste ambiente bloqueia `file://`; a versão incorporada é validada via HTTP, sem solicitar arquivos de recursos adicionais. Esse arquivo é uma prévia portátil, não um endereço público. Os registros locais do arquivo não migram automaticamente para uma hospedagem futura. Fontes e ícones fazem parte do build; não há dependência de fontes remotas. As rotas usam hashes, permitindo acesso direto sem regras especiais de redirecionamento.

## Organização

- `scripts/build-standalone.mjs`: geração da prévia HTML portátil.
- `src/CalendarExplorer.jsx`: seleção interativa dos 21 dias demonstrativos.
- `src/content.js`: dados centralizados dos cinco módulos, fases, nove treinos, orientações, capas e distribuição demonstrativa. Preserve os IDs ao atualizar textos.
- `src/main.jsx`: ponto de entrada; `src/App.jsx`: navegação e telas.
- `src/components.jsx`: componentes compartilhados; `src/pages/Hydration.jsx`: registros de água.
- `src/styles.css`: identidade visual e layouts responsivos.
- `public/media/`: arquivos reais aprovados, copiados ao build.
- `tests/member.spec.js`: testes funcionais e auditoria automática de acessibilidade.
- `artifacts/`: capturas desktop (1440 px) e celular (390 px).
- `docs/`: instruções de conteúdo, publicação e validação.

## Funcionalidades

Navegação pelos módulos e nove treinos; conclusão manual e reversível; leitura das orientações registrada separadamente; próximo treino calculado pelo primeiro não concluído; estado de conclusão dos nove; meta pessoal de água, inclusão, correção e exclusão de registros; calendário demonstrativo; menu móvel e navegação por teclado.

Os dados ficam no `localStorage`, chave `15m36:member:v1`. A água é separada por data local. A meta permanece ao mudar de dia. Não há sincronização entre dispositivos, conta ou acompanhamento profissional automatizado. Limpar os dados do navegador remove os registros. Outro domínio/origem começa com novos registros. Armazenamento bloqueado gera aviso.

## Conteúdos

Nenhum vídeo, exercício específico, receita ou PDF foi fornecido. A interface informa a indisponibilidade e não simula reprodução, download ou compra. As orientações em texto apoiam esta prévia. O encerramento é separado dos treinos. Não há bloqueio por data; conclusão informada não prova execução física nem 21 dias de prática.

Corpo sem Dor e Acesso Vitalício não concedem direitos de acesso. O bônus alimentar não é prescrição individual. Não há meta universal de água ou promessa de emagrecimento.

## Publicação

**Prévia pública:** https://gamedeiros23-rgb.github.io/15m36-Projeto/

Hospedagem própria deste repositório no GitHub Pages, pela branch `gh-pages` e caminho `/`. A identificação persistente e a URL estão em `deploy/github-pages.json`. Não há autenticação para abrir a prévia. Os dados registrados continuam locais em cada navegador.

Para atualizar **o mesmo endereço**, execute `npm run deploy`: o comando compila, atualiza a mesma branch e acompanha o build pela API. `npm run deploy:branch` apenas atualiza os arquivos; nesse caso, confirme o build e o site separadamente. Não há publicação da aplicação disparada apenas por atualizar `main`.

Para conferir o site em desktop e celular: `PUBLIC_PREVIEW_URL=https://gamedeiros23-rgb.github.io/15m36-Projeto/ npm run test:published`. Consulte `docs/PUBLICACAO.md`.

A entrega pela Hotmart exigirá decisões futuras de acesso, integração e conteúdo. O armazenamento local desta prévia não é um sistema de contas ou liberação comercial.
