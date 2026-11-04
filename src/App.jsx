import CalendarExplorer from "./CalendarExplorer";
import { Link, Button, Empty, Head } from "./components";
import Hydration from "./pages/Hydration";
import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  CalendarDays,
  Dumbbell,
  Droplets,
  Flame,
  Home,
  Layers,
  Menu,
  X,
  Utensils,
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  Lock,
  Info,
  Mountain,
  Target,
  RotateCcw,
} from "lucide-react";
import {
  phases,
  workouts,
  intro,
  modules,
  foodMaterials,
  recipes,
  complementary,
  moduleCovers,
} from "./content";
const KEY = "15m36:member:v1";
const today = () => new Date().toLocaleDateString("en-CA");
const initial = { completed: [], lessons: [], goal: null, water: {} };
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (!s) return initial;
    return {
      completed: Array.isArray(s.completed)
        ? s.completed.filter((id) => workouts.some((w) => w.id === id))
        : [],
      lessons: Array.isArray(s.lessons)
        ? s.lessons.filter((x) => typeof x === "string")
        : [],
      goal: Number.isFinite(s.goal) && s.goal > 0 ? s.goal : null,
      water: s.water && typeof s.water === "object" ? s.water : {},
    };
  } catch {
    return initial;
  }
}
const num = (n) => String(n).padStart(2, "0");
export default function App() {
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width:800px)").matches,
  );
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  const [state, setState] = useState(load);
  const [menu, setMenu] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [day, setDay] = useState(today());
  useEffect(() => {
    const fn = () => {
      setRoute(location.hash.slice(1) || "/");
      setMenu(false);
      window.scrollTo(0, 0);
      requestAnimationFrame(() =>
        document.querySelector("main")?.focus({ preventScroll: true }),
      );
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  useEffect(() => {
    const sync = () => setDay(today());
    const id = setInterval(sync, 15000);
    window.addEventListener("focus", sync);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", sync);
    };
  }, []);
  useEffect(() => {
    const mq = matchMedia("(max-width:800px)");
    const sync = () => {
      setMobile(mq.matches);
      if (!mq.matches) setMenu(false);
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!menu || !mobile) return;
    const aside = document.querySelector(".sidebar");
    aside.querySelector("a,button").focus();
    const key = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        requestAnimationFrame(() =>
          document.querySelector(".mobile-menu").focus(),
        );
      }
      if (e.key === "Tab") {
        const els = [...aside.querySelectorAll("a,button")].filter(
          (el) => el.getClientRects().length,
        );
        if (e.shiftKey && document.activeElement === els[0]) {
          e.preventDefault();
          els.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
          e.preventDefault();
          els[0].focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [menu, mobile]);
  const toggle = (key, id) =>
    setState((s) => ({
      ...s,
      [key]: s[key].includes(id)
        ? s[key].filter((x) => x !== id)
        : [...s[key], id],
    }));
  const completed = state.completed.length;
  const next = workouts.find((w) => !state.completed.includes(w.id));
  const current = phases[next?.phase ?? 2];
  const nav = [
    ["/", "Visão geral", Home],
    ["/treinos", "Treinos", Dumbbell],
    ["/alimentacao", "Alimentação", Utensils],
    ["/hidratacao", "Hidratação", Droplets],
    ["/calendario", "Calendário", CalendarDays],
    ["/modulos", "Meus módulos", Layers],
  ];
  const Mark = ({ id, lesson = false }) => {
    const yes = state[lesson ? "lessons" : "completed"].includes(id);
    return (
      <button
        className={`button ${yes ? "secondary done" : ""}`}
        onClick={() => toggle(lesson ? "lessons" : "completed", id)}
      >
        {yes ? <RotateCcw size={18} /> : <Check size={18} />}{" "}
        {yes
          ? lesson
            ? "Desfazer leitura"
            : "Desfazer conclusão"
          : lesson
            ? "Marcar orientação como lida"
            : "Marcar treino como concluído"}
      </button>
    );
  };
  function WorkoutCard({ w }) {
    const p = phases[w.phase],
      done = state.completed.includes(w.id);
    return (
      <Link to={`/treino/${w.number}`} className="workout-card">
        <div className="workout-top">
          <span className="tiny">
            {p.name} / {p.level}
          </span>
          {done ? (
            <CheckCircle2 className="orange" size={20} />
          ) : (
            <span className="tiny muted">15 MIN</span>
          )}
        </div>
        <div className="workout-number">
          {num(w.number)}
          <Dumbbell size={45} strokeWidth={1} />
        </div>
        <div className="workout-bottom">
          <div>
            <h3>Treino {num(w.number)}</h3>
            <p>{done ? "Conclusão registrada" : "Vídeo em preparação"}</p>
          </div>
          <span className="circle-arrow">
            <ArrowUpRight size={19} />
          </span>
        </div>
      </Link>
    );
  }
  function ModuleCards() {
    return (
      <div className="module-list">
        {modules.map((m) => {
          const cover = moduleCovers[m.id];
          return (
            <Link
              to={`/modulo/${m.id}`}
              key={m.id}
              className={`module-card module-${m.kind}`}
            >
              <div className={`module-cover cover-${m.id}`} aria-hidden="true">
                <span className="cover-brand">TEAM MEDEIROS</span>
                <span className="cover-plus">+</span>
                <span className="cover-orbit" />
                <div className="cover-copy">
                  <span>{cover.note}</span>
                  <strong>{cover.title}</strong>
                </div>
                <span className="cover-footer">
                  {m.kind === "phase"
                    ? `DIAS ${phases[m.phase].days} · EVO3`
                    : "MÉTODO GABRIEL MEDEIROS"}
                </span>
              </div>
              <div className="module-details">
                <span className="tiny orange">
                  MÓDULO <span className="module-index">{m.number}</span>
                </span>
                <h3>{m.title}</h3>
                <p>{m.subtitle}</p>
                <ArrowUpRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
  function Food() {
    const [meal, setMeal] = useState("Todas"),
      [method, setMethod] = useState("Todos");
    const filtered = recipes.filter(
      (r) =>
        (meal === "Todas" || r.meal === meal) &&
        (method === "Todos" || r.method === method),
    );
    return (
      <>
        <Head
          eyebrow="PILAR 02 · SUPER BÔNUS INCLUSO"
          title="Alimentação que cabe na rotina."
        >
          Dieta Metabólica · Comidas Deliciosas para Emagrecer
        </Head>
        <div className="notice">
          <Info size={19} />
          <span>
            Conteúdo educativo de organização alimentar. Não é uma prescrição
            alimentar individual.
          </span>
        </div>
        <Link className="resource bonus-orientation" to="/aula/bonus-alimentar">
          <BookOpen size={22} />
          <div>
            <h3>Conheça seu bônus alimentar</h3>
            <p>Orientação em texto · Vídeo em preparação</p>
          </div>
          <ChevronRight size={19} />
        </Link>
        <div className="section-heading">
          <h2>Seu caderno de receitas</h2>
          <span className="pill">BÔNUS ALIMENTAR</span>
        </div>
        {recipes.length > 0 ? (
          <>
            <div className="filters">
              <label>
                Refeição
                <select value={meal} onChange={(e) => setMeal(e.target.value)}>
                  {["Todas", ...new Set(recipes.map((r) => r.meal))].map(
                    (x) => (
                      <option key={x}>{x}</option>
                    ),
                  )}
                </select>
              </label>
              <label>
                Modo de preparo
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  {["Todos", ...new Set(recipes.map((r) => r.method))].map(
                    (x) => (
                      <option key={x}>{x}</option>
                    ),
                  )}
                </select>
              </label>
            </div>
            <div className="grid3">
              {filtered.map((r) => (
                <Link key={r.id} to={`/receita/${r.id}`} className="panel">
                  <h3>{r.name}</h3>
                  <p>
                    {r.meal} · {r.minutes} min
                  </p>
                </Link>
              ))}
            </div>
            {!filtered.length && <Empty title="Nenhuma receita neste filtro" />}
          </>
        ) : (
          <Empty title="As boas receitas estão chegando.">
            Nenhuma receita foi fornecida ainda. Quando disponíveis, as fichas
            terão ingredientes, preparo e informações práticas. Receitas de air
            fryer também farão parte deste bônus.
          </Empty>
        )}
        <div className="section-heading">
          <h2>Organize sua alimentação</h2>
        </div>
        <div className="resource-list">
          {foodMaterials.map((name, i) => (
            <div className="resource" key={name}>
              <span className="resource-icon">
                <BookOpen size={20} />
              </span>
              <div>
                <h3>{name}</h3>
                <p>Em preparação · Nenhum arquivo disponível</p>
              </div>
              <span className="pill muted">EM BREVE</span>
            </div>
          ))}
        </div>
      </>
    );
  }
  function Recipe({ id }) {
    const r = recipes.find((r) => r.id === id);
    if (!r)
      return (
        <>
          <Head title="Receita não disponível" />
          <Button to="/alimentacao" secondary>
            Voltar à alimentação
          </Button>
        </>
      );
    return (
      <>
        <Head eyebrow={r.meal} title={r.name}>
          {r.minutes} min · {r.yield}
        </Head>
        {["ingredients", "steps", "utensils", "substitutions"].map((key, i) => (
          <section className="panel" key={key}>
            <h2>
              {
                [
                  "Ingredientes e quantidades",
                  "Passo a passo",
                  "Utensílios",
                  "Substituições",
                ][i]
              }
            </h2>
            <ul>
              {(r[key] || []).map((x, j) => (
                <li key={j}>{x}</li>
              ))}
            </ul>
          </section>
        ))}
        <div className="panel">
          <p>Temperatura: {r.temperature || "Não se aplica"}</p>
          <p>Conservação: {r.storage || "Não informada"}</p>
          <p>Alergênicos: {r.allergens || "Não informados"}</p>
        </div>
        <Button to="/alimentacao" secondary>
          Voltar às receitas
        </Button>
      </>
    );
  }
  function Calendar() {
    return (
      <>
        <Head eyebrow="O PLANO · 21 DIAS" title="Um dia de cada vez.">
          Nove treinos principais. Espaço para recuperar. Hábitos para levar com
          você.
        </Head>
        <div className="notice">
          <Info size={20} />
          <strong>
            Programação demonstrativa — distribuição dos dias sujeita à
            definição do Gabriel.
          </strong>
        </div>
        <CalendarExplorer completed={state.completed} embedded />
        <div className="calendar-legend">
          <span>
            <i className="dot orange-bg" />
            Treino demonstrativo
          </span>
          <span>
            <i className="dot" />
            Recuperação
          </span>
          <span>
            <Droplets size={15} />
            <Utensils size={15} />
            Hábitos todos os dias
          </span>
        </div>
        {phases.map((p, pi) => (
          <section className="calendar-phase" key={p.id}>
            <div className="section-heading">
              <h2>
                <span className="orange">0{pi + 1}</span> {p.name}
              </h2>
              <span className="muted">
                Dias {p.days} · {p.level}
              </span>
            </div>
            <div className="week">
              {Array.from({ length: 7 }, (_, i) => {
                const index = [0, 2, 4].indexOf(i),
                  w = index >= 0 ? workouts[pi * 3 + index] : null;
                return (
                  <div
                    className={`calendar-day ${w ? "training-day" : ""}`}
                    key={i}
                  >
                    <span className="tiny">DIA {pi * 7 + i + 1}</span>
                    {w ? (
                      <Link to={`/treino/${w.number}`}>
                        <Dumbbell size={22} />
                        <strong>Treino {num(w.number)}</strong>
                        <span>
                          {state.completed.includes(w.id)
                            ? "Conclusão registrada"
                            : "15 minutos"}
                        </span>
                      </Link>
                    ) : (
                      <>
                        <Mountain size={22} />
                        <strong>
                          {pi === 2 && i === 6 ? "Encerramento" : "Recuperação"}
                        </strong>
                        <span>
                          {pi === 2 && i === 6 ? (
                            <Link to="/aula/encerramento">
                              Revisitar sua jornada →
                            </Link>
                          ) : (
                            "Respeite seu ritmo"
                          )}
                        </span>
                      </>
                    )}
                    <div className="daily-habits">
                      <Utensils size={13} />
                      <Droplets size={13} />
                      <span>Hábitos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        <p className="muted">
          Não há bloqueio por data. Abrir conteúdos não registra dias
          realizados. Alimentação e hidratação continuam nos dias de
          recuperação.
        </p>
      </>
    );
  }
  function Lesson({ id }) {
    const lesson = [...intro, ...complementary].find((x) => x.id === id);
    if (!lesson) return <NotFound />;
    return (
      <>
        <Link className="back" to={`/modulo/${lesson.module || "comece"}`}>
          <ArrowLeft size={16} /> Voltar ao módulo
        </Link>
        <Head
          eyebrow="ORIENTAÇÃO · PROGRESSO SEPARADO DOS TREINOS"
          title={lesson.title}
        />
        <Empty video title="Vídeo em preparação" />
        <section className="panel reading">
          <h2>Para colocar em prática</h2>
          <p>{lesson.text}</p>
          <Mark id={lesson.id} lesson />
          <p className="muted small">
            Registra a leitura desta orientação. Não registra treino nem
            reprodução de vídeo.
          </p>
        </section>
      </>
    );
  }
  function Workout({ number }) {
    const w = workouts.find((x) => x.number === Number(number));
    if (!w) return <NotFound />;
    const p = phases[w.phase];
    return (
      <>
        <Link to={`/modulo/${p.id}`} className="back">
          <ArrowLeft size={16} /> Voltar ao módulo {p.name}
        </Link>
        <Head
          eyebrow={`SISTEMA EVO3 · ${p.name} · ${p.level}`}
          title={`Treino ${num(w.number)}`}
        >
          Um passo para sua constância. Faça no seu ritmo.
        </Head>
        <div className="workout-facts">
          {[
            [Clock, "15 min", "Duração planejada"],
            [Flame, `${p.work}s / ${p.rest}s`, "Execução / descanso"],
            [Dumbbell, "5 exercícios", "Conteúdo em preparação"],
            [RotateCcw, "3 rodadas", "Estrutura do treino"],
          ].map(([Icon, value, label]) => (
            <div className="panel" key={label}>
              <Icon size={21} />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        {w.video ? (
          <video
            className="real-video"
            src={w.video}
            controls
            preload="metadata"
            aria-label={`Vídeo do treino ${num(w.number)}`}
          />
        ) : (
          <Empty video title="Vídeo em preparação">
            O vídeo e os exercícios deste treino ainda não foram fornecidos.
            Volte aqui quando o conteúdo estiver disponível.
          </Empty>
        )}
        <div className="two-col">
          <section className="panel">
            <h2>A estrutura do treino</h2>
            {w.exercises.map((e, i) => (
              <div className="exercise" key={i}>
                <span>{num(i + 1)}</span>
                {e}
              </div>
            ))}
          </section>
          <section className="panel">
            <h2>Antes de começar</h2>
            <p>
              Prepare um espaço seguro, respeite seus limites e interrompa a
              atividade em caso de dor ou mal-estar. As orientações específicas
              e adaptações deste treino estão em preparação.
            </p>
            <Link className="text-link" to="/aula/seguranca">
              Consultar orientações gerais <ArrowUpRight size={16} />
            </Link>
            <div className="divider" />
            <Mark id={w.id} />
            <p className="small muted">
              Registro informado por você. O sistema não verifica a execução
              física. Use quando tiver realizado o treino, mesmo que fora desta
              prévia.
            </p>
          </section>
        </div>
        <nav className="prev-next" aria-label="Sequência de treinos">
          {w.number > 1 ? (
            <Link to={`/treino/${w.number - 1}`}>
              <ArrowLeft size={18} /> Treino {num(w.number - 1)}
            </Link>
          ) : (
            <span />
          )}
          {w.number < 9 ? (
            <Link to={`/treino/${w.number + 1}`}>
              Treino {num(w.number + 1)} <ArrowRight size={18} />
            </Link>
          ) : (
            <Link to="/aula/encerramento">
              Encerramento <ArrowRight size={18} />
            </Link>
          )}
        </nav>
      </>
    );
  }
  function Module({ id }) {
    const m = modules.find((x) => x.id === id);
    if (!m) return <NotFound />;
    if (m.kind === "food") return <Food />;
    return (
      <>
        <Link className="back" to="/modulos">
          <ArrowLeft size={16} /> Todos os módulos
        </Link>
        <Head eyebrow={`MÓDULO ${m.number} · ${m.tag}`} title={m.title}>
          {m.subtitle}
        </Head>
        {m.kind === "intro" ? (
          <>
            <div className="notice">
              <Info size={19} />
              <span>
                Entre direto nos treinos quando quiser. Estas orientações não
                bloqueiam sua jornada.
              </span>
            </div>
            <div className="resource-list">
              {intro.map((l, i) => (
                <Link className="resource" to={`/aula/${l.id}`} key={l.id}>
                  <span className="lesson-number">{num(i + 1)}</span>
                  <div>
                    <h3>{l.title}</h3>
                    <p>Orientação em texto · Vídeo em preparação</p>
                  </div>
                  {state.lessons.includes(l.id) ? (
                    <CheckCircle2 className="orange" />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </Link>
              ))}
            </div>
            <p className="muted">
              {intro.filter((l) => state.lessons.includes(l.id)).length} de 6
              orientações lidas · Progresso independente dos treinos.
            </p>
            <Button to="/treinos">Conhecer os treinos</Button>
          </>
        ) : (
          <>
            <div className="phase-banner">
              <div>
                <Flame size={25} />
                <h2>{phases[m.phase].description}</h2>
              </div>
              <p>
                {phases[m.phase].work}s de execução · {phases[m.phase].rest}s de
                descanso
                <br />5 exercícios · 3 rodadas · 15 minutos por treino
              </p>
            </div>
            <div className="grid3">
              {workouts
                .filter((w) => w.phase === m.phase)
                .map((w) => (
                  <WorkoutCard key={w.id} w={w} />
                ))}
            </div>
            {m.phase === 2 && (
              <Link className="resource panel" to="/aula/encerramento">
                <CheckCircle2 size={25} />
                <div>
                  <h3>Dia 21 · Encerramento</h3>
                  <p>Conteúdo complementar · Não conta como treino</p>
                </div>
                <ArrowUpRight size={20} />
              </Link>
            )}
          </>
        )}
      </>
    );
  }
  function NotFound() {
    return (
      <>
        <Head title="Conteúdo não encontrado">
          Este endereço não corresponde a um conteúdo desta prévia.
        </Head>
        <Button to="/">Voltar ao início</Button>
      </>
    );
  }
  function Dashboard() {
    return (
      <>
        <div className="welcome-row">
          <span>
            <i className="dot orange-bg" /> SUA JORNADA, SEU RITMO.
          </span>
          <span className="tiny muted">ÁREA DE MEMBROS / PRÉVIA</span>
        </div>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">MÉTODO GABRIEL MEDEIROS</span>
            <h1>
              SEU DESAFIO DE 21 DIAS
              <br />
              <em>COMEÇA AGORA.</em>
            </h1>
            <p>
              Treinos progressivos, alimentação e hidratação. Um plano
              organizado para você entrar em ação e buscar menos medidas.
            </p>
            <Button to={next ? `/treino/${next.number}` : "/treinos"}>
              {next ? "CONTINUAR MEU DESAFIO" : "REVISITAR MEUS TREINOS"}
            </Button>
            <div className="hero-foot">
              <span>
                <Clock size={15} />
                15 MIN POR TREINO
              </span>
              <span>
                <Layers size={15} />3 FASES. UM NOVO RITMO.
              </span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-top">SISTEMA EVO3</span>
            <div className="orbital orbit1" />
            <div className="orbital orbit2" />
            <div className="art-number">
              15<span>M36</span>
            </div>
            <div className="art-bottom">
              <span>
                ATIVAR.
                <br />
                ACELERAR.
                <br />
                <b>EVOLUIR.</b>
              </span>
              <ArrowUpRight size={62} strokeWidth={1} />
            </div>
          </div>
        </section>
        <div className="method-facts" aria-label="Estrutura do desafio">
          {[
            ["21", "dias de desafio"],
            ["9", "treinos de 15 minutos"],
            ["3", "treinos por fase"],
            ["3", "fases do Sistema EVO3"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <section className="journey-strip">
          <div className="journey-icon">
            <Flame size={24} />
          </div>
          <div className="journey-title">
            <span className="tiny muted">
              {next ? "SEU PRÓXIMO PASSO" : "SEQUÊNCIA CONCLUÍDA"}
            </span>
            <h2>
              {next
                ? `Treino ${num(next.number)} · ${current.name}`
                : "Nove treinos. Constância para continuar."}
            </h2>
            <p>
              {next
                ? `${current.level} · 15 min · Vídeo em preparação`
                : "Você registrou os nove treinos. Isso não comprova 21 dias de prática."}
            </p>
          </div>
          <div className="journey-progress">
            <span>
              <strong>
                {completed}
                <small> / 9</small>
              </strong>
              <span>treinos concluídos</span>
            </span>
            <div className="progress-track">
              <div style={{ width: `${(completed / 9) * 100}%` }} />
            </div>
          </div>
          <Link
            to={next ? `/treino/${next.number}` : "/treinos"}
            className="circle-arrow large"
            aria-label={next ? "Abrir próximo treino" : "Revisitar treinos"}
          >
            <ArrowRight size={23} />
          </Link>
        </section>
        <div className="section-heading">
          <div>
            <span className="eyebrow">O BÁSICO BEM FEITO, TODOS OS DIAS.</span>
            <h2>Três pilares. Uma direção.</h2>
          </div>
        </div>
        <div className="pillar-grid">
          {[
            [
              Dumbbell,
              "01",
              "Treinos",
              "15 minutos para entrar em ação.",
              "/treinos",
            ],
            [
              Utensils,
              "02",
              "Alimentação",
              "Mais organização, menos complicação.",
              "/alimentacao",
            ],
            [
              Droplets,
              "03",
              "Hidratação",
              "Um cuidado que acompanha você.",
              "/hidratacao",
            ],
          ].map(([Icon, n, title, text, to]) => (
            <Link to={to} className="pillar-card" key={to}>
              <div className="pillar-top">
                <span className="pillar-icon">
                  <Icon size={27} />
                </span>
                <span className="tiny muted">PILAR {n}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowUpRight className="pillar-arrow" size={22} />
            </Link>
          ))}
        </div>
        <div className="section-heading">
          <div>
            <span className="eyebrow">SEU CAMINHO ESTÁ AQUI.</span>
            <h2>Explore os módulos</h2>
          </div>
          <Link to="/modulos" className="text-link">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <ModuleCards />
        <CalendarExplorer completed={state.completed} />
        <div className="calendar-cta">
          <div>
            <CalendarDays size={28} />
            <div>
              <h3>Enxergue os próximos passos.</h3>
              <p>Conheça a distribuição demonstrativa dos 21 dias.</p>
            </div>
          </div>
          <Button to="/calendario" secondary>
            Explorar calendário
          </Button>
        </div>
      </>
    );
  }
  let page;
  if (route === "/") page = <Dashboard />;
  else if (route === "/treinos")
    page = (
      <>
        <Head
          eyebrow="PILAR 01 · SISTEMA EVO3"
          title="15 minutos. Seu próximo passo."
        >
          Nove treinos, três fases. Escolha seu treino sem bloqueios por data.
        </Head>
        <div className="notice">
          <Info size={19} />
          <span>
            {completed} de 9 treinos com conclusão informada por você. A fase
            segue a sequência dos treinos, sem comprovar a passagem dos dias.
          </span>
        </div>
        {phases.map((p, i) => (
          <section key={p.id}>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  DIAS {p.days} · {p.level}
                </span>
                <h2>
                  <span className="orange">0{i + 1}</span> {p.name}
                </h2>
              </div>
              <Link to={`/modulo/${p.id}`} className="text-link">
                Ver módulo <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid3">
              {workouts
                .filter((w) => w.phase === i)
                .map((w) => (
                  <WorkoutCard key={w.id} w={w} />
                ))}
            </div>
          </section>
        ))}
      </>
    );
  else if (route === "/modulos")
    page = (
      <>
        <Head
          eyebrow="CONTEÚDO DO DESAFIO"
          title="Seu caminho, em cinco módulos."
        >
          Comece pelas orientações ou vá direto ao treino. Explore no seu ritmo.
        </Head>
        <ModuleCards />
        <section className="panel extras">
          <Lock size={21} />
          <div>
            <h3>Adicionais · Não incluídos nesta prévia</h3>
            <p>
              <strong>Método Corpo sem Dor:</strong> material complementar de
              mobilidade e adaptações para desconfortos em joelhos e costas, sem
              promessa de tratamento ou cura.
            </p>
            <p>
              <strong>Acesso Vitalício:</strong> condições e atualizações ainda
              a definir. Nenhum direito de acesso ou compra é simulado. Os 21
              dias são a duração do desafio, não um prazo de acesso.
            </p>
          </div>
        </section>
      </>
    );
  else if (route === "/alimentacao") page = <Food />;
  else if (route === "/hidratacao")
    page = <Hydration key={day} state={state} setState={setState} day={day} />;
  else if (route === "/calendario") page = <Calendar />;
  else if (route.startsWith("/treino/"))
    page = <Workout number={route.split("/")[2]} />;
  else if (route.startsWith("/modulo/"))
    page = <Module id={route.split("/")[2]} />;
  else if (route.startsWith("/aula/"))
    page = <Lesson id={route.split("/")[2]} />;
  else if (route.startsWith("/receita/"))
    page = <Recipe id={route.split("/")[2]} />;
  else page = <NotFound />;
  return (
    <>
      <a
        className="skip"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("main").focus({ preventScroll: true });
        }}
      >
        Pular para o conteúdo
      </a>
      <aside
        inert={mobile && !menu}
        aria-label="Navegação do desafio"
        className={`sidebar ${menu ? "open" : ""}`}
      >
        <Link to="/" className="brand">
          <span>
            TEAM<strong>MEDEIROS</strong>
          </span>
        </Link>
        <button
          className="icon-button close-menu"
          onClick={() => setMenu(false)}
          aria-label="Fechar menu"
        >
          <X />
        </button>
        <div className="challenge-label">
          <span>ÁREA DE MEMBROS</span>
          <strong>
            Desafio <b>15M36</b>
          </strong>
        </div>
        <span className="nav-label">SEU DESAFIO</span>
        <nav aria-label="Menu principal">
          {nav.map(([to, label, Icon]) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${route === to ? "active" : ""}`}
              aria-current={route === to ? "page" : undefined}
            >
              <Icon size={19} />
              {label}
              {route === to && <span className="active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="side-progress">
            <Flame size={21} />
            <span>
              Um passo de cada vez.
              <small>{completed} de 9 treinos concluídos</small>
            </span>
          </div>
          <div className="progress-track">
            <div style={{ width: `${(completed / 9) * 100}%` }} />
          </div>
          <div className="lesson-progress">
            <div>
              <span>Orientações lidas</span>
              <strong>
                {Math.round(
                  ([...intro, ...complementary].filter((l) =>
                    state.lessons.includes(l.id),
                  ).length /
                    8) *
                    100,
                )}
                %
              </strong>
            </div>
            <div className="progress-track">
              <div
                style={{
                  width: `${([...intro, ...complementary].filter((l) => state.lessons.includes(l.id)).length / 8) * 100}%`,
                }}
              />
            </div>
            <small>
              {
                [...intro, ...complementary].filter((l) =>
                  state.lessons.includes(l.id),
                ).length
              }{" "}
              de 8 · Separado dos treinos
            </small>
          </div>
          <p>MÉTODO GABRIEL MEDEIROS</p>
          <span className="preview-label">PRÉVIA DA EXPERIÊNCIA</span>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-backdrop"
          aria-label="Fechar navegação"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="workspace" inert={mobile && menu}>
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Abrir menu"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu />
          </button>
          <span className="topbar-title">
            DESAFIO <b>15M36</b>
            <span className="topbar-divider">/</span>
            <span className="muted">
              Sua melhor versão começa com uma ação.
            </span>
          </span>
          <Link to="/modulo/comece" className="top-help">
            <BookOpen size={17} />
            <span>Comece aqui</span>
            <ArrowUpRight size={15} />
          </Link>
        </header>
        <main id="main-content" tabIndex={-1} key={route}>
          {storageError && (
            <div role="alert" className="notice">
              O navegador bloqueou o armazenamento. Seus registros funcionam
              nesta sessão, mas podem não permanecer após recarregar.
            </div>
          )}
          {page}
        </main>
        <footer>
          <span>
            TEAM MEDEIROS <b>·</b> DESAFIO 15M36
          </span>
          <p>
            <Lock size={12} /> Dados salvos neste navegador, sem sincronização
            entre dispositivos.
          </p>
          <span>PRÉVIA FUNCIONAL · SEM LOGIN</span>
        </footer>
      </div>
    </>
  );
}
