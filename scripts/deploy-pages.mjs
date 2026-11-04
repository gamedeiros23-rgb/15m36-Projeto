import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

const root = process.cwd();
const branchOnly = process.argv.includes("--branch-only");
const configPath = resolve("deploy/github-pages.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
if (config.provider !== "github-pages" || config.path !== "/")
  throw new Error("Configuração de publicação não suportada.");
function command(bin, args, options = {}) {
  const result = spawnSync(bin, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(
      `${bin} ${args.slice(0, 3).join(" ")}: ${result.stderr || result.stdout}`,
    );
  return result.stdout.trim();
}
function api(path, method = "GET", body) {
  return JSON.parse(
    command(
      "gh",
      ["api", "--method", method, path, ...(body ? ["--input", "-"] : [])],
      body ? { input: JSON.stringify(body) } : {},
    ),
  );
}
const repo = api(`repos/${config.repository}`);
if (repo.full_name.toLowerCase() !== config.repository.toLowerCase())
  throw new Error("Repositório de publicação inesperado.");
let site;
if (!branchOnly) {
  try {
    site = api(`repos/${config.repository}/pages`);
  } catch (error) {
    if (!error.message.includes("HTTP 404")) throw error;
  }
}
if (
  site &&
  (site.source?.branch !== config.branch || site.source?.path !== config.path)
)
  throw new Error(
    "Existe uma publicação com outra origem. Interrompido para preservar a configuração existente.",
  );
const temp = mkdtempSync(join(tmpdir(), "15m36-pages-"));
try {
  writeFileSync(resolve("dist/.nojekyll"), "");
  const env = {
    ...process.env,
    GIT_INDEX_FILE: join(temp, "index"),
    GIT_AUTHOR_NAME: "Codex",
    GIT_AUTHOR_EMAIL: "codex@users.noreply.github.com",
    GIT_COMMITTER_NAME: "Codex",
    GIT_COMMITTER_EMAIL: "codex@users.noreply.github.com",
  };
  const remote = command("git", [
    "ls-remote",
    "origin",
    `refs/heads/${config.branch}`,
  ]);
  const parent = remote ? remote.split(/\s/)[0] : null;
  if (parent)
    command("git", [
      "fetch",
      "--no-tags",
      "origin",
      `refs/heads/${config.branch}`,
    ]);
  command("git", ["read-tree", "--empty"], { env });
  command(
    "git",
    [`--work-tree=${resolve("dist")}`, "add", "--all", "--force", "--", "."],
    { env },
  );
  const tree = command("git", ["write-tree"], { env });
  const commit = command(
    "git",
    ["commit-tree", tree, ...(parent ? ["-p", parent] : [])],
    { env, input: "Publish Desafio 15M36 preview\n" },
  );
  console.log(
    "Enviando o build para a branch de publicação existente/configurada...",
  );
  command("git", ["push", "origin", `${commit}:refs/heads/${config.branch}`]);
  if (branchOnly) {
    console.log(
      "Branch atualizada. A publicação pública ainda precisa ser confirmada no GitHub Pages.",
    );
    process.exitCode = 0;
  } else {
    if (!site) {
      console.log("Criando GitHub Pages para este repositório...");
      try {
        site = api(`repos/${config.repository}/pages`, "POST", {
          source: { branch: config.branch, path: config.path },
          build_type: "legacy",
        });
      } catch (error) {
        if (error.message.includes("HTTP 403")) {
          config.activation = "manual-required";
          writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
          throw new Error(
            `O build já foi enviado. A integração não pode ativar o Pages. Abra https://github.com/${config.repository}/settings/pages e selecione Deploy from a branch, ${config.branch}, /(root), Save. Nenhuma publicação pública foi confirmada.`,
          );
        }
        throw error;
      }
    }

    const pageUrl = site.html_url;
    if (!pageUrl?.startsWith("https://"))
      throw new Error("O GitHub ainda não retornou uma URL HTTPS.");
    if (config.url && config.url !== pageUrl)
      throw new Error(
        "A URL retornada mudou; verificar configuração antes de atualizar o endereço salvo.",
      );
    config.url = pageUrl;
    config.activation = "enabled";
    writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
    console.log(
      "Configuração do site salva. Aguardando a implantação do GitHub Pages...",
    );
    let built = false;
    for (let attempt = 0; attempt < 36; attempt++) {
      let build;
      try {
        build = api(`repos/${config.repository}/pages/builds/latest`);
      } catch (error) {
        if (!error.message.includes("HTTP 404")) throw error;
      }
      if (build?.status === "built" && build.commit === commit) {
        built = true;
        break;
      }
      if (build?.status === "errored" && build.commit === commit)
        throw new Error(
          `GitHub Pages: ${build.error?.message || "falha na compilação"}`,
        );
      if (attempt % 4 === 0)
        console.log(`Status: ${build?.status || "aguardando primeiro build"}`);
      await new Promise((r) => setTimeout(r, 5000));
    }
    if (!built)
      throw new Error(
        "A publicação ainda não terminou. Consulte o status antes de declarar o site publicado.",
      );
    const html = command("curl", [
      "--fail",
      "--silent",
      "--show-error",
      "--connect-timeout",
      "10",
      "--max-time",
      "30",
      pageUrl,
    ]);
    if (!html.includes("Desafio 15M36"))
      throw new Error("O conteúdo público retornado não corresponde à prévia.");
    console.log(`PUBLICADO E ACESSÍVEL SEM AUTENTICAÇÃO: ${pageUrl}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
