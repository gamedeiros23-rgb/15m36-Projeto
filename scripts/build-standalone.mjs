import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";

// Gera uma prévia portátil a partir dos mesmos artefatos de produção.
const dist = resolve("dist");
let html = readFileSync(resolve(dist, "index.html"), "utf8");
html = html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
  const code = readFileSync(resolve(dist, src), "utf8").replace(
    /<\/script/gi,
    "<\\/script",
  );
  return `<script type="module">${code}</script>`;
});
html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g,
  (_, href) => {
    const cssPath = resolve(dist, href);
    const css = readFileSync(cssPath, "utf8").replace(
      /url\(([^)]+)\)/g,
      (_, value) => {
        const src = value.trim().replace(/^['"]|['"]$/g, "");
        if (src.startsWith("data:")) return `url(${src})`;
        if (/^https?:/.test(src))
          throw new Error(
            "A prévia portátil não deve depender de recursos remotos.",
          );
        const file = resolve(dirname(cssPath), src),
          extension = extname(file).slice(1);
        const mime =
          {
            woff: "font/woff",
            woff2: "font/woff2",
            png: "image/png",
            svg: "image/svg+xml",
          }[extension] || "application/octet-stream";
        return `url(data:${mime};base64,${readFileSync(file).toString("base64")})`;
      },
    );
    return `<style>${css}</style>`;
  },
);
writeFileSync(resolve(dist, "15m36.html"), html);
console.log("Prévia portátil gerada: dist/15m36.html");
