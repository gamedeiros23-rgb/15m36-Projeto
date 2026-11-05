# Inserção de conteúdo aprovado

## Vídeos e exercícios

Os dados dos módulos e treinos continuam em `src/content.js`. Preserve os IDs. Copie um vídeo autorizado para `public/media/` e configure `video` no treino com o caminho relativo. Sem URL, a tela mantém “Vídeo em preparação”. Insira apenas os cinco exercícios reais aprovados em `exercises`.

As sete orientações de Comece aqui estão em `intro`, incluindo “Conheça seu bônus alimentar”. `complementary` mantém o encerramento. O progresso das orientações continua separado dos treinos. Os vídeos introdutórios precisam de campo e renderização próprios quando forem fornecidos; ler texto não equivale a assistir vídeo. Capas e calendário demonstrativo estão em `moduleCovers` e `calendarDays`.

## Alimentação

O cardápio de quatro refeições e as 40 receitas reais agora estão incorporados. Consulte `ALIMENTACAO.md` para fontes, extração e limitações.

`src/food-documents.json` identifica os PDFs com ID, título, caminho relativo, páginas e descrição. Não remova um arquivo antes de atualizar seus links. Os PDFs são copiados para o build e incorporados à versão HTML portátil.

`src/food-content.json` contém:

- `recipes`: receitas reais, com IDs estáveis `receita-01` a `receita-40`.
- `mealPlan`: combinações principais e alternativas por refeição.
- `substitutionGroups`, `shopping`, `bases`, `planning`, `safety`, `reading`: orientações presentes nos materiais.

Cada receita tem `id`, `number`, `name`, `meal`, `method` (descrição original), `methods` (categorias do filtro), `prepTime`, `cookTime`, `yield`, `ingredients` (lista com quantidades), `steps` (lista ordenada), `utensils`, `substitutions`, `serving`, `storage`, `allergens`, `temperature` quando indicada e `sourcePage`.

As fichas abrem em `/#/receita/receita-01`, etc. Preservar tempos de espera, condições de ingredientes já cozidos, notas de conservação e alergênicos. Informação não fornecida não equivale a ausência de alergênicos. Não inventar receitas para preencher estados vazios.

## Imagens e pendências

Imagens autorizadas vão em `public/media/`, com texto alternativo e dimensões otimizadas. A composição atual é tipográfica, sem retrato do Gabriel ou depoimentos inventados.

Ainda faltam vídeos e exercícios, adaptações, calendário definitivo, roteiro alimentar diário de 21 dias, conteúdo final de encerramento, condições dos adicionais e regras de acesso comercial. Os 21 dias não definem prazo de acesso. O cardápio de quatro refeições não substitui a individualização das porções.
