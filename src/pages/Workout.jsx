import React, { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Flame,
  Dumbbell,
  RotateCcw,
  Check,
  CheckCircle2,
} from "lucide-react";
import { workouts, phases } from "../content";
import { Link, Head, Empty, Button } from "../components";
const pad = (n) => String(n).padStart(2, "0");
export default function Workout({
  number,
  challengeStarted,
  onStart,
  onToggle,
  completed,
}) {
  const statusRef = useRef(null);
  const w = workouts.find((x) => x.number === Number(number));
  if (!w)
    return (
      <>
        <Head title="Treino não encontrado" />
        <Button to="/treinos" secondary>
          Voltar aos treinos
        </Button>
      </>
    );
  const p = phases[w.phase];
  const done = completed.includes(w.id);
  return (
    <>
      <Link to={`/modulo/${p.id}`} className="back">
        <ArrowLeft size={16} /> Voltar ao módulo {p.name}
      </Link>
      <Head
        eyebrow={`SISTEMA EVO3 · ${p.name} · ${p.level}`}
        title={`Treino ${pad(w.number)}`}
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
      {!challengeStarted ? (
        <section className="panel workout-start">
          <div>
            <span className="eyebrow">NO SEU RITMO</span>
            <h2>Pronta para começar?</h2>
            <p>
              Registre quando for iniciar a prática. Depois, seu próximo treino
              ficará à mão na visão geral. Abrir esta página não inicia nem
              conclui o treino.
            </p>
          </div>
          <button
            className="button"
            onClick={() => {
              onStart();
              requestAnimationFrame(() =>
                statusRef.current?.focus({ preventScroll: true }),
              );
            }}
          >
            <Flame size={18} />
            Registrar início do treino
          </button>
        </section>
      ) : (
        <p className="start-status" role="status" ref={statusRef} tabIndex={-1}>
          <CheckCircle2 size={17} />
          Início do desafio registrado. Acesso rápido disponível na visão geral.
        </p>
      )}
      {w.video ? (
        <video
          className="real-video"
          src={w.video}
          controls
          onPlay={onStart}
          preload="metadata"
          aria-label={`Vídeo do treino ${pad(w.number)}`}
        />
      ) : (
        <Empty video title="Vídeo em preparação">
          O vídeo e os exercícios deste treino ainda não foram fornecidos. Volte
          aqui quando o conteúdo estiver disponível.
        </Empty>
      )}
      <div className="two-col">
        <section className="panel">
          <h2>A estrutura do treino</h2>
          {w.exercises.map((e, i) => (
            <div className="exercise" key={i}>
              <span>{pad(i + 1)}</span>
              {e}
            </div>
          ))}
        </section>
        <section className="panel">
          <h2>Antes de começar</h2>
          <p>
            Prepare um espaço seguro, respeite seus limites e interrompa a
            atividade em caso de dor ou mal-estar. As orientações específicas e
            adaptações deste treino estão em preparação.
          </p>
          <Link className="text-link" to="/aula/seguranca">
            Consultar orientações gerais <ArrowUpRight size={16} />
          </Link>
          <div className="divider" />
          <button
            className={`button ${done ? "secondary done" : ""}`}
            onClick={() => onToggle(w.id)}
          >
            {done ? <RotateCcw size={18} /> : <Check size={18} />}{" "}
            {done ? "Desfazer conclusão" : "Marcar treino como concluído"}
          </button>
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
            <ArrowLeft size={18} /> Treino {pad(w.number - 1)}
          </Link>
        ) : (
          <span />
        )}
        {w.number < 9 ? (
          <Link to={`/treino/${w.number + 1}`}>
            Treino {pad(w.number + 1)} <ArrowRight size={18} />
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
