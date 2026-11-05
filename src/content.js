export const phases = [
  {
    id: "ativar",
    name: "ATIVAR",
    level: "Iniciante",
    days: "1 a 7",
    work: 35,
    rest: 25,
    description: "O primeiro passo é entrar em movimento.",
  },
  {
    id: "acelerar",
    name: "ACELERAR",
    level: "Intermediário",
    days: "8 a 14",
    work: 40,
    rest: 20,
    description: "Construa ritmo. Fortaleça sua constância.",
  },
  {
    id: "evoluir",
    name: "EVOLUIR",
    level: "Avançado",
    days: "15 a 21",
    work: 50,
    rest: 10,
    description: "Continue avançando, no seu ritmo.",
  },
];
export const workouts = Array.from({ length: 9 }, (_, i) => ({
  id: `treino-${String(i + 1).padStart(2, "0")}`,
  number: i + 1,
  phase: Math.floor(i / 3),
  video: null,
  exercises: Array(5).fill("Exercício em preparação"),
}));
export const intro = [
  {
    id: "boas-vindas",
    title: "Boas-vindas do Gabriel",
    text: "Este é seu espaço para organizar uma rotina de movimento, alimentação e hidratação. A mensagem em vídeo do Gabriel está em preparação.",
  },
  {
    id: "como-funciona",
    title: "Como funciona o desafio de 21 dias",
    text: "São 21 dias, nove treinos principais de 15 minutos e três fases: ATIVAR, ACELERAR e EVOLUIR. Distribua a prática com dias de recuperação. O calendário é demonstrativo.",
  },
  {
    id: "evo3",
    title: "Entenda o Sistema EVO3",
    text: "Cada fase tem três treinos, com cinco exercícios em três rodadas. A execução e o descanso variam por fase. Recuperação e adaptação continuam após o exercício; as 36 horas fazem parte da comunicação do método, sem representar duração fisiológica comprovada ou garantia de queima de gordura.",
  },
  {
    id: "pilares",
    title: "Os três pilares do método",
    text: "Movimente-se com os treinos, organize sua alimentação e registre a hidratação. Pequenas ações consistentes ajudam a construir sua rotina, sem promessa de resultados garantidos.",
  },
  {
    id: "orientacoes-agua",
    title: "Orientações de hidratação",
    text: "Cadastre uma meta pessoal adequada às suas necessidades. Esta ferramenta registra o que você informa; ela não calcula uma prescrição nem oferece acompanhamento profissional automatizado.",
  },
  {
    id: "seguranca",
    title: "Como iniciar e adaptar com segurança",
    text: "Respeite seus limites e prepare um espaço livre e seguro. Se sentir dor ou mal-estar, interrompa a atividade e procure orientação profissional. Exercícios e adaptações específicos ainda serão fornecidos.",
  },
  {
    id: "bonus-alimentar",
    title: "Conheça seu bônus alimentar",
    module: "comece",
    text: "A Dieta Metabólica reúne os espaços para roteiro alimentar, receitas, substituições econômicas, lista de compras e preparo das refeições. As receitas de air fryer fazem parte deste mesmo conjunto. Consulte o cardápio de quatro refeições e as 40 receitas do e-book Cozinha na Rotina. Eles incluem substituições, lista de compras, preparos de base e orientações de conservação. O roteiro diário de 21 dias continua em preparação. Este bônus é educativo e não substitui uma prescrição alimentar individual.",
  },
];
export const modules = [
  {
    id: "comece",
    number: "01",
    title: "COMECE AQUI",
    subtitle: "Sua jornada começa com o primeiro passo.",
    tag: "BOAS-VINDAS",
    kind: "intro",
  },
  {
    id: "alimentacao",
    number: "02",
    title: "DIETA METABÓLICA",
    subtitle: "Comidas Deliciosas para Emagrecer",
    tag: "SUPER BÔNUS INCLUSO",
    kind: "food",
  },
  ...phases.map((p, i) => ({
    id: p.id,
    number: String(i + 3).padStart(2, "0"),
    title: `SISTEMA EVO3: ${p.name}`,
    subtitle: `Dias ${p.days} · ${p.level}`,
    tag: `FASE 0${i + 1}`,
    kind: "phase",
    phase: i,
  })),
];

export const complementary = [
  {
    id: "encerramento",
    title: "Dia 21 · Encerramento",
    module: "evoluir",
    text: "Reserve um momento para observar sua rotina: o que ajudou sua constância? O que você quer manter? Revisite os conteúdos no seu ritmo. Concluir nove treinos não comprova 21 dias de prática. O encerramento é um conteúdo complementar, não um décimo treino.",
  },
];
export const calendarDays = Array.from({ length: 21 }, (_, i) => {
  const phase = Math.floor(i / 7),
    position = [0, 2, 4].indexOf(i % 7);
  return {
    day: i + 1,
    phase,
    workout: position < 0 ? null : workouts[phase * 3 + position],
    closing: i === 20,
  };
});
export const moduleCovers = {
  comece: { title: "Comece\naqui.", note: "SEU PRIMEIRO PASSO" },
  alimentacao: { title: "Comer\nbem.", note: "SUPER BÔNUS INCLUSO" },
  ativar: { title: "Ativar.", note: "O PRIMEIRO MOVIMENTO" },
  acelerar: { title: "Acelerar.", note: "CONSTRUA SEU RITMO" },
  evoluir: { title: "Evoluir.", note: "CONTINUE AVANÇANDO" },
};
