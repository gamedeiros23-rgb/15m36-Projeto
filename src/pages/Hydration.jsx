import React, { useState } from "react";
import { Droplets, Plus, Pencil, Trash2, Info } from "lucide-react";
import { Head } from "../components";
export default function Hydration({ state, setState, day }) {
  const [goal, setGoal] = useState(state.goal ?? "");
  const [amount, setAmount] = useState("");
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");
  const entries = Array.isArray(state.water[day]) ? state.water[day] : [];
  const total = entries.reduce((n, e) => n + (Number(e.amount) || 0), 0);
  const progress = state.goal ? Math.min(100, (total / state.goal) * 100) : 0;
  const valid = (v) =>
    /^\d+$/.test(String(v)) && Number(v) > 0 && Number.isSafeInteger(Number(v));
  const saveGoal = (e) => {
    e.preventDefault();
    if (!valid(goal) || Number(goal) > 20000) {
      setError(
        "Informe uma meta entre 1 e 20.000 mL, sem casas decimais. Esse limite é de registro, não uma recomendação.",
      );
      return;
    }
    setState((s) => ({ ...s, goal: Number(goal) }));
    setError("");
  };
  const saveWater = (e) => {
    e.preventDefault();
    if (!valid(amount) || Number(amount) > 5000) {
      setError("Informe de 1 a 5.000 mL por registro, sem casas decimais.");
      return;
    }
    const entry = {
      id: edit || crypto.randomUUID(),
      amount: Number(amount),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setState((s) => {
      const es = Array.isArray(s.water[day]) ? s.water[day] : [];
      return {
        ...s,
        water: {
          ...s.water,
          [day]: edit
            ? es.map((x) =>
                x.id === edit ? { ...x, amount: entry.amount } : x,
              )
            : [...es, entry],
        },
      };
    });
    setEdit(null);
    setAmount("");
    setError("");
  };
  return (
    <>
      <Head
        eyebrow="PILAR 03 · UM HÁBITO DE CADA VEZ"
        title="Hidrate sua rotina."
      >
        Sua meta, seus registros. Acompanhe a água que você informa ao longo do
        dia.
      </Head>
      <div className="hydration-grid">
        <section className="panel water-panel">
          <span className="tiny">
            HOJE · {new Date().toLocaleDateString("pt-BR")}
          </span>
          <div className="water-orbit" style={{ "--progress": `${progress}%` }}>
            <div>
              <Droplets size={31} />
              <strong>
                {total.toLocaleString("pt-BR")}
                <small>mL registrados</small>
              </strong>
            </div>
          </div>
          <h2>
            {state.goal
              ? `${Math.round((total / state.goal) * 100)}% da sua meta`
              : "Vamos definir sua meta?"}
          </h2>
          <p>
            {state.goal
              ? `Meta pessoal: ${state.goal.toLocaleString("pt-BR")} mL`
              : "Cadastre sua meta pessoal no formulário ao lado."}
          </p>
          <p className="tiny muted">
            O CONTADOR DO DIA RECOMEÇA À MEIA-NOITE LOCAL.
          </p>
        </section>
        <div className="form-stack">
          <section className="panel">
            <h2>Sua meta pessoal</h2>
            <p>
              Use uma meta adequada às suas necessidades. Não calculamos uma
              prescrição.
            </p>
            <form onSubmit={saveGoal}>
              <label htmlFor="goal">Meta diária em mL</label>
              <div className="input-row">
                <input
                  id="goal"
                  type="number"
                  min="1"
                  max="20000"
                  step="1"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="Informe sua meta"
                />
                <button className="button" type="submit">
                  Salvar meta
                </button>
              </div>
            </form>
            {state.goal && (
              <button
                className="text-button"
                onClick={() => {
                  setState((s) => ({ ...s, goal: null }));
                  setGoal("");
                }}
              >
                Remover meta
              </button>
            )}
          </section>
          <section className="panel">
            <h2>{edit ? "Corrigir registro" : "Registrar água"}</h2>
            <form onSubmit={saveWater}>
              <label htmlFor="amount">Quantidade consumida em mL</label>
              <div className="input-row">
                <input
                  id="amount"
                  type="number"
                  min="1"
                  max="5000"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex.: 250"
                />
                <button className="button" type="submit">
                  {edit ? (
                    "Salvar correção"
                  ) : (
                    <>
                      <Plus size={17} /> Registrar
                    </>
                  )}
                </button>
              </div>
            </form>
            {edit && (
              <button
                className="text-button"
                onClick={() => {
                  setEdit(null);
                  setAmount("");
                }}
              >
                Cancelar correção
              </button>
            )}
          </section>
        </div>
      </div>
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}
      <section className="panel">
        <div className="section-heading">
          <h2>Registros de hoje</h2>
          <span className="muted">{entries.length} registro(s)</span>
        </div>
        {!entries.length ? (
          <p>Nenhum registro hoje. Seu primeiro copo pode entrar aqui.</p>
        ) : (
          entries.map((e) => (
            <div className="water-entry" key={e.id}>
              <Droplets size={18} />
              <strong>{e.amount} mL</strong>
              <span>{e.time}</span>
              <button
                aria-label={`Corrigir registro de ${e.amount} mL`}
                className="icon-button"
                onClick={() => {
                  setEdit(e.id);
                  setAmount(e.amount);
                  document.getElementById("amount").focus();
                }}
              >
                <Pencil size={17} />
              </button>
              <button
                aria-label={`Remover registro de ${e.amount} mL`}
                className="icon-button"
                onClick={() => {
                  setState((s) => ({
                    ...s,
                    water: {
                      ...s.water,
                      [day]: s.water[day].filter((x) => x.id !== e.id),
                    },
                  }));
                  if (edit === e.id) {
                    setEdit(null);
                    setAmount("");
                  }
                }}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))
        )}
      </section>
      <div className="notice">
        <Info size={19} />
        <span>
          Registro pessoal, sem acompanhamento profissional automatizado.
          Necessidades de hidratação variam. Em caso de restrição de líquidos ou
          dúvida, procure orientação profissional.
        </span>
      </div>
    </>
  );
}
