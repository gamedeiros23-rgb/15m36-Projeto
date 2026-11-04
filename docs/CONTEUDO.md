# Inserção de conteúdo aprovado

Centralize alterações em `src/content.js`. Preserve os IDs: atualizar textos não deve apagar o progresso.

## Treinos

Copie o vídeo autorizado para `public/media/treino-01.mp4` e configure `video` no treino como `media/treino-01.mp4`. A tela exibe um vídeo real com controles quando o campo está preenchido; sem URL, mantém “Vídeo em preparação”. URLs externas HTTPS precisam de acesso público e permissões adequadas. Insira os cinco exercícios reais aprovados em `exercises`. Fases, tempos e rodadas estão centralizados nos dados.

## Aulas e materiais

As seis orientações estão em `intro`. O array `complementary` centraliza a apresentação do bônus alimentar e o encerramento. Ambos são orientações complementares e não somam aos nove treinos. As capas ficam em `moduleCovers` e a distribuição demonstrativa em `calendarDays`. Vídeos introdutórios ainda são placeholders; quando fornecidos, adicionar campo de vídeo e renderização condicional equivalente à dos treinos. Ler texto não equivale a assistir vídeo.

Os cinco materiais alimentares são indisponíveis. Quando um PDF autorizado existir, colocá-lo em `public/media/`, transformar o item textual em objeto com ID estável, título e URL e adicionar link real. Não usar URLs vazias, `#` ou downloads fictícios. Nenhum PDF está incluído.

## Receitas

O array `recipes` está vazio. Somente conteúdo real aprovado deve ser adicionado. Havendo conteúdo, listagem e filtros por refeição e modo de preparo aparecem automaticamente. Campos:

- `id`: identificador estável e único.
- `name`, `meal`, `method`: nome, refeição e modo de preparo; air fryer é um modo dentro do bônus.
- `minutes`, `yield`: tempo em minutos e rendimento.
- `ingredients`: lista de ingredientes com quantidades.
- `steps`: etapas ordenadas.
- `utensils`: utensílios.
- `temperature`: temperatura quando aplicável.
- `substitutions`: lista de substituições aprovadas.
- `storage`: conservação.
- `allergens`: alergênicos quando informados; ausência de informação não significa ausência de alergênicos.

A ficha abre em `/#/receita/ID`. Não há receitas fictícias. Filtros e fichas não foram validados com receitas reais porque nenhum conteúdo foi fornecido.

## Imagens e pendências

Imagens autorizadas vão em `public/media/`, com texto alternativo e dimensões otimizadas. A composição atual é tipográfica com CSS e ícones genéricos; não usa retrato do Gabriel, depoimentos ou logotipo apresentado como oficial.

Faltam: vídeos e exercícios, adaptações, calendário definitivo, receitas, roteiro alimentar, lista de compras e PDFs, conteúdo final de encerramento, condições dos adicionais e regras de acesso. Os 21 dias não definem prazo de acesso.
