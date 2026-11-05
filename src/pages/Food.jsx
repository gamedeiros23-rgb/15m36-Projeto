import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Download,
  FileText,
  BookOpen,
  Info,
  Utensils,
  Clock,
  ChefHat,
  Search,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Head, Link, Empty } from "../components";
import {
  recipes,
  mealPlan,
  mealNames,
  cookingMethods,
  documents,
  documentUrl,
  normalize,
  substitutionGroups,
  shopping,
  bases,
  planning,
  safety,
  reading,
  fruitOptions,
  baseStorage,
  about,
} from "../food";
const pad = (n) => String(n).padStart(2, "0");
function Source({ document = "receitas", page, children }) {
  return (
    <a
      href={documentUrl(document, page)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link source-link"
    >
      {children || `Conferir no PDF · página ${page}`}
      <ArrowUpRight size={14} />
    </a>
  );
}
export function FoodDownloads() {
  return (
    <div className="food-downloads">
      {documents.map((doc) => (
        <section className="document-card" key={doc.id}>
          <div className="document-top">
            <span className="resource-icon">
              <FileText size={24} />
            </span>
            <span className="pill">PDF · {doc.pages} PÁGINAS</span>
          </div>
          <h2>{doc.title}</h2>
          <p>{doc.description}</p>
          <div className="document-actions">
            <a
              href={documentUrl(doc.id)}
              className="button secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar PDF <ArrowUpRight size={16} />
            </a>
            <a
              className="text-link"
              href={documentUrl(doc.id)}
              download={doc.url.split("/").at(-1)}
              aria-label={`Baixar PDF: ${doc.title}`}
            >
              <Download size={15} />
              Baixar PDF<span className="sr-only">: {doc.title}</span>
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}
function MealPlan() {
  const [selected, setSelected] = useState(mealPlan[0].id);
  const meal = mealPlan.find((m) => m.id === selected);
  return (
    <section className="meal-plan" aria-labelledby="meal-plan-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">SEU GUIA DE OPÇÕES</span>
          <h2 id="meal-plan-heading">Quatro refeições. Mais possibilidades.</h2>
        </div>
      </div>
      <p className="food-intro">
        Escolha uma combinação completa por refeição. As alternativas substituem
        a combinação principal; não são opções para somar todas no mesmo prato.
      </p>
      <div
        className="meal-selector"
        role="group"
        aria-label="Escolher refeição do cardápio"
      >
        {mealPlan.map((m, i) => (
          <button
            key={m.id}
            aria-pressed={selected === m.id}
            onClick={() => setSelected(m.id)}
          >
            <span>{pad(i + 1)}</span>
            {m.name}
          </button>
        ))}
      </div>
      <div className="meal-content">
        <div className="meal-principal">
          <span className="eyebrow">COMBINAÇÃO PRINCIPAL</span>
          <h3>{meal.name}</h3>
          <p>{meal.principal}</p>
          <Source document="cardapio" page={meal.sourcePage} />
        </div>
        <div className="meal-alternatives">
          <div className="section-heading">
            <h3>Escolha uma alternativa</h3>
            <span>{meal.alternatives.length} opções</span>
          </div>
          <ol>
            {meal.alternatives.map((text, i) => (
              <li key={i}>
                <span>{pad(i + 1)}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {selected === "cafe-da-manha" && (
        <p className="food-caption">
          <strong>Frutas para variar:</strong> {fruitOptions}
        </p>
      )}
      <div className="food-note">
        <Info size={17} />
        <p>
          As porções precisam de ajuste individual. As combinações e trocas não
          são equivalências exatas de calorias ou proteína. Este guia de quatro
          refeições não é um roteiro diário fechado de 21 dias.
        </p>
      </div>
    </section>
  );
}
function Guide({
  title,
  description,
  items,
  page,
  document = "receitas",
  note,
}) {
  return (
    <details className="food-guide">
      <summary>
        <span>
          <BookOpen size={18} />
          <strong>{title}</strong>
        </span>
        <ChevronRight size={19} />
      </summary>
      <div className="guide-body">
        {description && <p>{description}</p>}
        {items.map((item) => (
          <section key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </section>
        ))}
        {note && <p className="food-caption">{note}</p>}
        <Source document={document} page={page} />
      </div>
    </details>
  );
}
export default function Food() {
  const [meal, setMeal] = useState("Todas"),
    [method, setMethod] = useState("Todos"),
    [query, setQuery] = useState("");
  const filtered = recipes.filter(
    (r) =>
      (meal === "Todas" || r.meal === meal) &&
      (method === "Todos" || r.methods.includes(method)) &&
      normalize(`${r.name} ${r.ingredients.join(" ")}`).includes(
        normalize(query.trim()),
      ),
  );
  const reset = () => {
    setMeal("Todas");
    setMethod("Todos");
    setQuery("");
  };
  return (
    <>
      <Head
        eyebrow="PILAR 02 · SUPER BÔNUS INCLUSO"
        title="Alimentação que cabe na rotina."
      >
        Dieta Metabólica · Cardápio de quatro refeições + Cozinha na Rotina
      </Head>
      <div className="notice">
        <Info size={19} />
        <span>
          Material de apoio à rotina alimentar. Porções e rendimentos culinários
          não são uma prescrição individual nem garantem déficit calórico.
        </span>
      </div>
      <FoodDownloads />
      <Link className="resource bonus-orientation" to="/aula/bonus-alimentar">
        <BookOpen size={22} />
        <div>
          <h3>Conheça seu bônus alimentar</h3>
          <p>Orientação em texto · Vídeo em preparação</p>
        </div>
        <ChevronRight size={19} />
      </Link>
      <MealPlan />
      <section aria-labelledby="recipes-heading" className="recipe-library">
        <div className="section-heading">
          <div>
            <span className="eyebrow">COZINHA NA ROTINA</span>
            <h2 id="recipes-heading">Seu caderno de receitas</h2>
          </div>
          <span className="pill">40 RECEITAS DO E-BOOK</span>
        </div>
        <p className="food-intro">
          Fogão, forno, air fryer e outras possibilidades. Escolha a refeição e
          encontre uma receita para sua rotina.
        </p>
        <div className="recipe-filters">
          <div className="filter-control">
            <label htmlFor="recipe-search">Buscar receita ou ingrediente</label>
            <div className="search-field">
              <Search size={17} />
              <input
                id="recipe-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: frango, aveia, panqueca"
              />
            </div>
          </div>
          <div className="filter-control">
            <label htmlFor="meal-filter">Refeição</label>
            <select
              id="meal-filter"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
            >
              <option>Todas</option>
              {mealNames.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="filter-control">
            <label htmlFor="method-filter">Modo de preparo</label>
            <select
              id="method-filter"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option>Todos</option>
              {cookingMethods.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="recipe-results">
          <p role="status">
            {filtered.length} de {recipes.length} receitas
          </p>
          {(meal !== "Todas" || method !== "Todos" || query) && (
            <button className="text-button" onClick={reset}>
              Limpar filtros
            </button>
          )}
        </div>
        {filtered.length ? (
          <div className="recipe-grid">
            {filtered.map((r) => (
              <Link key={r.id} to={`/receita/${r.id}`} className="recipe-card">
                <div className="recipe-card-top">
                  <span className="recipe-index">{pad(r.number)}</span>
                  <span className="pill">{r.method}</span>
                </div>
                <span className="eyebrow">{r.meal}</span>
                <h3>{r.name}</h3>
                <p>
                  <Clock size={13} />
                  Organização: {r.prepTime}
                </p>
                <div className="recipe-card-bottom">
                  <span>{r.yield}</span>
                  <ArrowUpRight size={19} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            <Empty title="Nenhuma receita neste filtro">
              Tente outra refeição, modo de preparo ou ingrediente.
            </Empty>
            <button className="button secondary" onClick={reset}>
              Mostrar todas as receitas
            </button>
          </>
        )}
        <p className="food-caption">
          Tempos estimados, conforme o e-book. Os preparos não foram testados em
          cozinha nesta produção. Receitas de air fryer fazem parte deste mesmo
          bônus.
        </p>
      </section>
      <section aria-labelledby="food-guides-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAIS PRATICIDADE NO DIA A DIA</span>
            <h2 id="food-guides-heading">Organize sua alimentação</h2>
          </div>
        </div>
        <Guide
          title="Substituições por grupos de alimentos"
          description="Use os grupos do cardápio para variar o almoço. As trocas exigem ajuste de porções e não são equivalências exatas."
          items={substitutionGroups}
          page={3}
          document="cardapio"
        />
        <Guide
          title="Lista de compras"
          description="Escolha as receitas primeiro e some as quantidades para o número de porções. Esta é uma lista de categorias, não uma compra obrigatória de todos os itens."
          items={shopping}
          page={46}
        />
        <Guide
          title="Preparos de base"
          description="Quando a ficha pedir um ingrediente já cozido, consulte estas bases ou siga o rótulo de uma versão pronta."
          items={bases}
          page={47}
          note={baseStorage}
        />
        <Guide
          title="Organização e preparo das refeições"
          items={planning}
          page={48}
          note={about}
        />
        <Guide
          title="Medidas, tempos e substituições"
          items={reading}
          page={2}
        />
        <Guide
          title="Cuidados na cozinha e conservação"
          items={safety}
          page={3}
          note="Prefira leite, queijos e iogurtes pasteurizados. Identifique os potes com nome e data. Na dúvida sobre tempo ou temperatura de conservação, descarte."
        />
        <div className="resource pending-food">
          <CalendarIcon />
          <div>
            <h3>Roteiro alimentar de 21 dias</h3>
            <p>
              Em preparação · Os PDFs fornecidos trazem opções de refeições e
              receitas, sem distribuição diária para os 21 dias.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
function CalendarIcon() {
  return <CalendarDays size={22} />;
}
