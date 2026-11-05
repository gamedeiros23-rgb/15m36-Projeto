import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
async function goto(page, path = "/") {
  await page.goto("/#" + path);
  await expect(page.locator("main")).toBeVisible();
}
test("all screens, five modules, nine workouts and no broken layout", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const routes = [
    "/",
    "/treinos",
    "/modulos",
    "/modulo/comece",
    "/modulo/alimentacao",
    "/modulo/ativar",
    "/modulo/acelerar",
    "/modulo/evoluir",
    "/alimentacao",
    "/hidratacao",
    "/calendario",
    ...Array.from({ length: 9 }, (_, i) => `/treino/${i + 1}`),
    ...[
      "boas-vindas",
      "como-funciona",
      "evo3",
      "pilares",
      "orientacoes-agua",
      "seguranca",
      "encerramento",
    ].map((id) => `/aula/${id}`),
  ];
  for (const path of routes) {
    await goto(page, path);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.locator("video")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /play|reproduzir|baixar/i }),
    ).toHaveCount(0);
  }
  await goto(page, "/modulos");
  await expect(page.locator(".module-card")).toHaveCount(5);
  expect(await page.locator(".module-index").allTextContents()).toEqual([
    "01",
    "02",
    "03",
    "04",
    "05",
  ]);
  await goto(page, "/treinos");
  await expect(page.locator(".workout-card")).toHaveCount(9);
  await goto(page, "/calendario");
  await expect(page.locator(".calendar-day")).toHaveCount(21);
  await expect(page.locator(".training-day")).toHaveCount(9);
  await expect(
    page.getByText(
      "Programação demonstrativa — distribuição dos dias sujeita à definição do Gabriel.",
    ),
  ).toBeVisible();
  await goto(page, "/alimentacao");
  await expect(
    page.getByRole("heading", { name: "Seu caderno de receitas" }),
  ).toBeVisible();
  await expect(page.locator("select")).toHaveCount(2);
  await expect(page.locator(".recipe-card")).toHaveCount(40);
  expect(errors).toEqual([]);
});
test("workout completion persists, reverses and stays separate from lessons", async ({
  page,
}) => {
  await goto(page, "/treino/1");
  await expect(
    page.getByRole("button", { name: "Marcar treino como concluído" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Marcar treino como concluído" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Desfazer conclusão" }),
  ).toBeVisible();
  await goto(page, "/");
  await expect(page.locator(".journey-title")).toContainText("Treino 02");
  await goto(page, "/aula/como-funciona");
  await page
    .getByRole("button", { name: "Marcar orientação como lida" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Desfazer leitura" }),
  ).toBeVisible();
  let saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("15m36:member:v1")),
  );
  expect(saved.completed).toEqual(["treino-01"]);
  expect(saved.lessons).toEqual(["como-funciona"]);
  await page.getByRole("button", { name: "Desfazer leitura" }).click();
  await goto(page, "/treino/1");
  await page.getByRole("button", { name: "Desfazer conclusão" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Marcar treino como concluído" }),
  ).toBeVisible();
  for (let n = 1; n <= 9; n++) {
    await goto(page, `/treino/${n}`);
    await page
      .getByRole("button", { name: "Marcar treino como concluído" })
      .click();
  }
  await goto(page, "/");
  await expect(page.getByText("SEQUÊNCIA CONCLUÍDA")).toBeVisible();
  await expect(
    page.getByText(/Isso não comprova 21 dias de prática/),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "REVISITAR MEUS TREINOS" }),
  ).toBeVisible();
});
test("previous, next and module links work", async ({ page }) => {
  await goto(page, "/treino/5");
  await page
    .getByRole("navigation", { name: "Sequência de treinos" })
    .getByRole("link", { name: "Treino 04" })
    .click();
  await expect(page).toHaveURL(/treino\/4$/);
  await page
    .getByRole("navigation", { name: "Sequência de treinos" })
    .getByRole("link", { name: "Treino 05" })
    .click();
  await expect(page).toHaveURL(/treino\/5$/);
  await page.getByRole("link", { name: "Voltar ao módulo ACELERAR" }).click();
  await expect(page.locator(".workout-card")).toHaveCount(3);
});
test("hydration goal, entries, corrections, deletion and local day change", async ({
  page,
}) => {
  await goto(page, "/hidratacao");
  await expect(
    page.getByRole("heading", { name: "Vamos definir sua meta?" }),
  ).toBeVisible();
  await page.getByLabel("Meta diária em mL").fill("2000");
  await page.getByRole("button", { name: "Salvar meta" }).click();
  await page.getByLabel("Quantidade consumida em mL").fill("250");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(page.locator(".water-entry")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".water-orbit strong")).toContainText("250");
  await expect(
    page.getByRole("heading", { name: "13% da sua meta" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Corrigir registro de 250 mL" })
    .click();
  await page.getByLabel("Quantidade consumida em mL").fill("400");
  await page.getByRole("button", { name: "Salvar correção" }).click();
  await expect(page.locator(".water-orbit strong")).toContainText("400");
  await page
    .getByRole("button", { name: "Remover registro de 400 mL" })
    .click();
  await expect(page.locator(".water-entry")).toHaveCount(0);
  await page.getByLabel("Quantidade consumida em mL").fill("-1");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await expect(page.locator(".water-entry")).toHaveCount(0);
  await page.getByLabel("Quantidade consumida em mL").fill("300");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await page.clock.install();
  await page.clock.setSystemTime(new Date(Date.now() + 86400000));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.locator(".water-entry")).toHaveCount(0);
  await expect(page.locator(".water-orbit strong")).toContainText("0");
  await expect(page.getByLabel("Meta diária em mL")).toHaveValue("2000");
  await page.getByRole("button", { name: "Remover meta" }).click();
  await expect(
    page.getByRole("heading", { name: "Vamos definir sua meta?" }),
  ).toBeVisible();
});
test("navigation and keyboard work and screenshots are captured", async ({
  page,
}, info) => {
  await goto(page);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `artifacts/${info.project.name}-inicio.png`,
    fullPage: true,
  });
  if (info.project.name === "mobile") {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.locator(".sidebar")).toHaveClass(/open/);
    await page
      .getByRole("navigation", { name: "Menu principal" })
      .getByRole("link", { name: "Hidratação" })
      .click();
    await expect(page).toHaveURL(/hidratacao$/);
    await expect(page.locator(".sidebar")).not.toHaveClass(/open/);
  } else {
    await page
      .getByRole("navigation", { name: "Menu principal" })
      .getByRole("link", { name: "Hidratação" })
      .click();
  }
  await page.screenshot({
    path: `artifacts/${info.project.name}-hidratacao.png`,
    fullPage: true,
  });
  await goto(page, "/treino/1");
  await page.screenshot({
    path: `artifacts/${info.project.name}-treino.png`,
    fullPage: true,
  });
  await goto(page, "/calendario");
  await page.screenshot({
    path: `artifacts/${info.project.name}-calendario.png`,
    fullPage: true,
  });
  for (const [path, name] of [['/alimentacao','alimentacao'],['/modulos','modulos']]) {
    await goto(page,path);
    await page.screenshot({path:`artifacts/${info.project.name}-${name}.png`,fullPage:true});
  }
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
test("mobile menu traps focus and closes with Escape", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await goto(page);
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.locator(".brand")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page
      .getByRole("navigation", { name: "Menu principal" })
      .getByRole("link", { name: "Meus módulos" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".brand")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await expect(page.locator(".sidebar")).toHaveAttribute("inert", "");
});

test("WCAG AA automated accessibility audit", async ({ page }) => {
  for (const route of [
    "/",
    "/treinos",
    "/modulos",
    "/treino/1",
    "/alimentacao",
    "/hidratacao",
    "/calendario",
    "/aula/evo3",
  ]) {
    await goto(page, route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        null,
        2,
      ),
    ).toEqual([]);
  }
});
