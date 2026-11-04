import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Dumbbell,
  Droplets,
  Utensils,
  Mountain,
  Info,
} from "lucide-react";
import { Link } from "./components";
import { calendarDays, phases } from "./content";
export default function CalendarExplorer({ completed = [], embedded = false }) {
  const [selected, setSelected] = useState(1);
  const d = calendarDays[selected - 1],
    p = phases[d.phase];
  return (
    <section className="calendar-explorer" aria-label="Explorar os 21 dias">
      {!embedded && (
        <>
          <div className="section-heading">
            <div>
              <span className="eyebrow">CONHEÇA O CAMINHO</span>
              <h2>21 dias, um passo de cada vez.</h2>
            </div>
            <Link to="/calendario" className="text-link">
              Abrir calendário <ArrowUpRightIcon />
            </Link>
          </div>
          <div className="notice">
            <Info size={17} />
            <span>
              Programação demonstrativa — distribuição dos dias sujeita à
              definição do Gabriel.
            </span>
          </div>
        </>
      )}
      <div className="explorer-legend">
        {phases.map((phase, i) => (
          <span key={phase.id}>
            <i className={`phase-dot phase-${i}`} />
            {phase.name}
            <small>DIAS {phase.days}</small>
          </span>
        ))}
      </div>
      <div
        className="day-strip"
        role="group"
        aria-label="Selecionar dia demonstrativo"
      >
        {calendarDays.map((day) => (
          <button
            key={day.day}
            className={`day-chip phase-${day.phase} ${day.workout ? "has-training" : ""}`}
            aria-pressed={selected === day.day}
            aria-label={`Dia ${day.day}: ${day.workout ? `Treino ${String(day.workout.number).padStart(2, "0")}` : day.closing ? "Encerramento e recuperação" : "Recuperação"}`}
            onClick={() => setSelected(day.day)}
          >
            <span>DIA</span>
            <strong>{String(day.day).padStart(2, "0")}</strong>
            {day.workout ? <Dumbbell size={13} /> : <Mountain size={13} />}
            <i
              className={
                day.workout && completed.includes(day.workout.id)
                  ? "recorded"
                  : ""
              }
            />
          </button>
        ))}
      </div>
      <div className="day-details" aria-live="polite">
        <div>
          <span className="eyebrow">
            DIA {selected} · {p.level} · DEMONSTRAÇÃO
          </span>
          <h3>
            {p.name} ·{" "}
            {d.workout
              ? "Dia de treino"
              : d.closing
                ? "Encerramento e recuperação"
                : "Dia de recuperação"}
          </h3>
          <p>
            {d.workout
              ? `Sugestão demonstrativa: Treino ${String(d.workout.number).padStart(2, "0")}. O conteúdo ainda está em preparação.`
              : "Respeite seu ritmo. Alimentação e hidratação continuam nos dias de recuperação."}
          </p>
          <div className="day-habits">
            <Utensils size={14} />
            <span>Alimentação</span>
            <Droplets size={14} />
            <span>Hidratação</span>
          </div>
        </div>
        <div className="day-action">
          {d.workout ? (
            <Link to={`/treino/${d.workout.number}`} className="text-link">
              Conhecer treino {String(d.workout.number).padStart(2, "0")}{" "}
              <ArrowRight size={16} />
            </Link>
          ) : d.closing ? (
            <Link to="/aula/encerramento" className="text-link">
              Abrir encerramento <ArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/hidratacao" className="text-link">
              Registrar minha água <ArrowRight size={16} />
            </Link>
          )}
          <div className="day-controls">
            <button
              className="icon-button"
              disabled={selected === 1}
              onClick={() => setSelected((n) => n - 1)}
              aria-label="Dia anterior"
            >
              <ArrowLeft size={16} />
            </button>
            <span>{selected} / 21</span>
            <button
              className="icon-button"
              disabled={selected === 21}
              onClick={() => setSelected((n) => n + 1)}
              aria-label="Próximo dia"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <p className="calendar-disclaimer">
        Selecionar um dia não registra sua realização nem bloqueia conteúdos por
        data.
      </p>
    </section>
  );
}
function ArrowUpRightIcon() {
  return <CalendarDays size={15} />;
}
