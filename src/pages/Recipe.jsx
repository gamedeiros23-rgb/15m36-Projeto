import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  ChefHat,
  Utensils,
  Info,
} from "lucide-react";
import { Head, Link, Button } from "../components";
import { recipes, documentUrl } from "../food";
export default function Recipe({ id }) {
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
  const index = recipes.indexOf(r);
  return (
    <>
      <Link to="/alimentacao" className="back">
        <ArrowLeft size={16} />
        Voltar à alimentação
      </Link>
      <Head
        eyebrow={`COZINHA NA ROTINA · RECEITA ${String(r.number).padStart(2, "0")} · ${r.meal}`}
        title={r.name}
      >
        {r.method} · {r.yield}
      </Head>
      <div className="recipe-facts">
        <div>
          <Clock size={20} />
          <span>Organização</span>
          <strong>{r.prepTime}</strong>
        </div>
        <div>
          <ChefHat size={20} />
          <span>Cocção / espera</span>
          <strong>{r.cookTime}</strong>
        </div>
        <div>
          <Utensils size={20} />
          <span>Rendimento culinário</span>
          <strong>{r.yield}</strong>
        </div>
      </div>
      <div className="food-note">
        <Info size={17} />
        <p>
          Tempos estimados; confira o ponto antes de servir. As porções são
          rendimentos culinários e devem ser ajustadas às necessidades
          individuais.
        </p>
      </div>
      <div className="recipe-detail-grid">
        <section className="panel recipe-ingredients">
          <span className="eyebrow">SEPARE OS INGREDIENTES</span>
          <h2>Ingredientes e quantidades</h2>
          <ul>
            {r.ingredients.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <div className="divider" />
          <h3>Utensílios</h3>
          <p>{r.utensils}</p>
          {r.temperature && (
            <p>
              <strong>Temperatura do preparo:</strong> {r.temperature}
            </p>
          )}
        </section>
        <section className="panel recipe-steps">
          <span className="eyebrow">UMA ETAPA DE CADA VEZ</span>
          <h2>Como preparar</h2>
          <ol>
            {r.steps.map((x, i) => (
              <li key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{x}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
      <section className="panel recipe-substitutions">
        <h2>Substituições e variações</h2>
        <p>{r.substitutions}</p>
      </section>
      <div className="two-col">
        <section className="panel">
          <h2>Como servir</h2>
          <p>{r.serving}</p>
        </section>
        <section className="panel">
          <h2>Conservação</h2>
          <p>{r.storage}</p>
        </section>
      </div>
      <section className="allergen-note">
        <Info size={18} />
        <div>
          <h2>Alergênicos e rótulos</h2>
          <p>{r.allergens}</p>
          <p>
            Confira os rótulos e as possíveis contaminações cruzadas. Sem
            lactose não significa sem leite.
          </p>
        </div>
      </section>
      <div className="recipe-source">
        <span>Fonte: Cozinha na Rotina · página {r.sourcePage} de 48</span>
        <a
          className="text-link"
          href={documentUrl("receitas", r.sourcePage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Conferir receita no e-book
          <ArrowUpRight size={16} />
        </a>
      </div>
      <nav className="prev-next" aria-label="Sequência de receitas">
        {index > 0 ? (
          <Link to={`/receita/${recipes[index - 1].id}`}>
            <ArrowLeft size={17} />
            Receita anterior
          </Link>
        ) : (
          <span />
        )}
        {index < recipes.length - 1 ? (
          <Link to={`/receita/${recipes[index + 1].id}`}>
            Próxima receita
            <ArrowRight size={17} />
          </Link>
        ) : (
          <Link to="/alimentacao">
            Voltar às receitas
            <ArrowRight size={17} />
          </Link>
        )}
      </nav>
    </>
  );
}
