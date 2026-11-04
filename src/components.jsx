import React from "react";
import { ArrowUpRight, Layers, BookOpen } from "lucide-react";
export const Link = ({ to, children, className = "", ...props }) => (
  <a href={`#${to}`} className={className} {...props}>
    {children}
  </a>
);
export const Button = ({ to, children, secondary = false }) => (
  <Link to={to} className={`button ${secondary ? "secondary" : ""}`}>
    {children}
    <ArrowUpRight size={18} />
  </Link>
);
export const Empty = ({ title = "Em preparação", children, video = false }) => (
  <div className={`empty ${video ? "video-empty" : ""}`}>
    <div className="empty-icon">
      {video ? <Layers size={29} /> : <BookOpen size={26} />}
    </div>
    <h3>{title}</h3>
    <p>
      {children ||
        "O conteúdo será disponibilizado aqui quando estiver pronto."}
    </p>
    <span className="status-dot">
      {video ? "CONTEÚDO AINDA NÃO DISPONÍVEL" : "NOVOS CONTEÚDOS EM BREVE"}
    </span>
  </div>
);
export const Head = ({ eyebrow, title, children }) => (
  <header className="page-head">
    <div className="eyebrow">{eyebrow || "DESAFIO 15M36"}</div>
    <h1>{title}</h1>
    {children && <p>{children}</p>}
  </header>
);
