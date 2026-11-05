import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");

test("four meal options and real recipe filters work", async ({
  page,
}, info) => {
  await page.goto("/#/alimentacao");
  await expect(page.locator(".recipe-card")).toHaveCount(40);
  const meals = page.getByRole("group", {
    name: "Escolher refeição do cardápio",
  });
  for (const [name, count, sample] of [
    ["Café da manhã", 12, "Pão francês com ovos mexidos + mamão."],
    ["Almoço", 10, "Quinoa + lentilha + tofu grelhado + legumes assados."],
    ["Café da tarde", 14, "Homus com pão integral + iogurte natural."],
    ["Jantar", 14, "Omelete com legumes + batata cozida + folhas."],
  ]) {
    await meals.getByRole("button", { name: new RegExp(name + "$") }).click();
    await expect(page.locator(".meal-alternatives li")).toHaveCount(count);
    await expect(page.locator(".meal-alternatives")).toContainText(sample);
  }
  await page.getByLabel("Refeição", { exact: true }).selectOption("Jantar");
  await expect(page.locator(".recipe-card")).toHaveCount(10);
  await page.getByLabel("Modo de preparo").selectOption("Air fryer");
  await expect(page.locator(".recipe-card")).toHaveCount(2);
  await expect(page.locator(".recipe-card")).toContainText([
    "Espetinhos de frango com legumes",
    "Bolinho de peixe e batata",
  ]);
  await page
    .locator(".recipe-library")
    .screenshot({
      path: `artifacts/${info.project.name}-receitas-filtradas.png`,
    });
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await page.getByLabel("Buscar receita ou ingrediente").fill("grao-de-bico");
  await expect(
    page.getByRole("link", { name: /Bolinhos de grão-de-bico e cenoura/ }),
  ).toBeVisible();
  await page
    .getByLabel("Buscar receita ou ingrediente")
    .fill("xyz-sem-receita");
  await expect(
    page.getByRole("heading", { name: "Nenhuma receita neste filtro" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mostrar todas as receitas" }).click();
  await expect(page.locator(".recipe-card")).toHaveCount(40);
  await page
    .locator(".food-guide")
    .filter({ hasText: "Lista de compras" })
    .locator("summary")
    .click();
  await expect(
    page.getByRole("heading", { name: "Proteínas e laticínios" }),
  ).toBeVisible();
  await page
    .locator(".food-guide")
    .filter({ hasText: "Preparos de base" })
    .locator("summary")
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Frango cozido e desfiado",
      exact: true,
    }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `artifacts/${info.project.name}-bonus-alimentar.png`,
    fullPage: true,
  });
});
test("all forty real recipe pages render and preserve preparation details", async ({
  page,
}, info) => {
  test.setTimeout(60000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (let n = 1; n <= 40; n++) {
    await page.goto(`/#/receita/receita-${String(n).padStart(2, "0")}`);
    await expect(
      page.getByRole("heading", { name: "Ingredientes e quantidades" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Como preparar", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".recipe-ingredients li").first()).toBeVisible();
    expect(
      await page.locator(".recipe-steps li").count(),
    ).toBeGreaterThanOrEqual(3);
    await expect(
      page.getByRole("heading", { name: "Conservação", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".allergen-note")).not.toContainText("undefined");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await expect(page.locator("h1")).toHaveText("Bolinho de peixe e batata");
  await expect(page.locator(".recipe-ingredients")).toContainText(
    "200 g de peixe já cozido, sem pele e sem espinhas",
  );
  await expect(page.locator(".recipe-steps")).toContainText("74 °C no centro");
  await page
    .getByRole("link", { name: "Receita anterior", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Crepioca de frango e tomate");
  await page
    .getByRole("link", { name: "Próxima receita", exact: true })
    .click();
  await expect(page.locator("h1")).toHaveText("Bolinho de peixe e batata");
  await page.goto("/#/receita/receita-03");
  await expect(page.locator(".recipe-facts")).toContainText(
    "6-12 h de geladeira",
  );
  await expect(page.locator(".recipe-substitutions")).toContainText(
    "isso não os torna adequados para alergia ao leite",
  );
  await page.goto("/#/receita/receita-06");
  await expect(page.locator(".recipe-facts")).toContainText(
    "10-15 min a 160 °C",
  );
  await page.screenshot({
    path: `artifacts/${info.project.name}-receita-real.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("both original PDFs download intact, including the portable HTML", async ({
  page,
  request,
}) => {
  for (const file of [
    "cardapio-4-refeicoes-team-medeiros.pdf",
    "cozinha-na-rotina-team-medeiros.pdf",
  ]) {
    const response = await request.get(`/media/${file}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect(sha(await response.body())).toBe(
      sha(readFileSync(`public/media/${file}`)),
    );
  }
  await page.goto("/#/alimentacao");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: /Baixar PDF: Cardápio alimentar/ }).click(),
  ]);
  expect(sha(readFileSync(await download.path()))).toBe(
    sha(readFileSync("public/media/cardapio-4-refeicoes-team-medeiros.pdf")),
  );
  await page.goto("/15m36.html#/alimentacao");
  const ebook = page.getByRole("link", {
    name: /Baixar PDF: Cozinha na Rotina/,
  });
  await expect(ebook).toHaveAttribute("href", /^blob:/);
  const [portable] = await Promise.all([
    page.waitForEvent("download"),
    ebook.click(),
  ]);
  expect(sha(readFileSync(await portable.path()))).toBe(
    sha(readFileSync("public/media/cozinha-na-rotina-team-medeiros.pdf")),
  );
});
