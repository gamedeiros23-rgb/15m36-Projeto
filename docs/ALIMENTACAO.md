# Bônus alimentar incorporado

## Fontes fornecidas pelo responsável

- `public/media/cardapio-4-refeicoes-team-medeiros.pdf`: Cardápio alimentar, seis páginas.
- `public/media/cozinha-na-rotina-team-medeiros.pdf`: Cozinha na Rotina, 48 páginas.

Os arquivos são cópias integrais dos PDFs enviados. A autorização de conteúdo veio da solicitação do usuário para inseri-los no produto; textos internos dos PDFs foram tratados como conteúdo de referência, não como instruções para operar o ambiente.

## Conteúdo na interface

O cardápio tem quatro refeições, combinações principais e 50 alternativas: 12 para café da manhã, dez para almoço, 14 para café da tarde e 14 para jantar. As alternativas substituem a combinação principal, sem somar todas. O documento inclui cinco grupos de substituição. Não há definição de porções individuais ou distribuição de refeições pelos 21 dias.

O e-book tem 40 receitas, dez por refeição. Todas foram transcritas para fichas navegáveis com nome, modo de preparo, organização, cocção/espera, rendimento culinário, ingredientes e quantidades, etapas, utensílios, temperatura quando indicada, substituições, como servir, conservação e alergênicos/rótulos. Tempos de espera e ingredientes previamente cozidos foram preservados; não foi calculado um tempo total fictício.

As fichas incluem o número da página de origem e um link para ela. A busca aceita nomes e ingredientes sem exigir acentos. Os filtros combinam refeição e método; receitas com mais de um método entram nos métodos correspondentes. A air fryer é um modo de preparo dentro do mesmo bônus.

A interface também disponibiliza as listas de compras, bases de preparo, planejamento, medidas culinárias e cuidados de conservação/higiene presentes nos PDFs. Mantém as ressalvas do material sobre porções, substituições, alergias, tempos estimados e ausência de testes em cozinha. Não afirma validação nutricional nem prescreve uma dieta individual.

## Organização técnica

- `src/food-content.json`: conteúdo extraído e revisado; receitas, cardápio, substituições e guias.
- `src/food-documents.json`: identificação dos dois PDFs e seus caminhos.
- `src/food.js`: catálogo, filtros e resolução dos links.
- `src/pages/Food.jsx`: cardápio, biblioteca, PDFs e guias.
- `src/pages/Recipe.jsx`: ficha individual.
- `scripts/import-food-pdfs.py`: extração reproduzível, usando `pdftotext` (Poppler). Não é executado no build e não adiciona dependência de Python ao site.

Para reextrair os mesmos PDFs: `python3 scripts/import-food-pdfs.py`. O importador verifica a numeração e a presença dos campos das 40 receitas e as quantidades das alternativas do cardápio. IDs `receita-01` a `receita-40` são estáveis; preserve-os em futuras revisões, sem trocar a identidade de uma receita já publicada.

A versão `dist/15m36.html` incorpora os dois PDFs como dados locais e gera URLs Blob para consulta/download. Assim, não depende de PDFs que existam apenas no computador de desenvolvimento. A versão hospedada usa os arquivos de `public/media/`.

## Continua em preparação

Roteiro alimentar com distribuição diária dos 21 dias, vídeos, exercícios específicos e outros materiais não fornecidos. O guia de quatro refeições não foi transformado em uma prescrição ou programação diária inventada. Os registros existentes de treino, leitura e água mantêm os mesmos IDs e a mesma chave local.

## Integridade dos originais

SHA-256 do cardápio: `bcfdbe118e674216de85bbf50b0acd870ac9e0dd03938cf1ed813e54c52ad642`.

SHA-256 do e-book: `b311a02bbbb7bece912a61951e0d79086aa1209ae42a1b8691724cb7c103b2c6`.

A auditoria textual das 40 receitas preservou ingredientes, quantidades, etapas, utensílios, substituições, modo de servir, conservação e alergênicos, alterando apenas espaços e apresentação dos marcadores.
