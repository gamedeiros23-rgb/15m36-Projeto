import { test, expect } from "@playwright/test";
const KEY = "15m36:member:v1";
async function checkOrder(page, started) {
  const order = await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const afterHero = hero.nextElementSibling;
    const modules = document.querySelector(".overview-modules");
    return {
      afterHero: afterHero.className,
      afterShortcut:
        document.querySelector(".journey-strip")?.nextElementSibling.className,
      afterModules: modules.nextElementSibling.className,
      noOverflow: document.documentElement.scrollWidth <= innerWidth,
    };
  });
  expect(order.afterHero).toBe(started ? "journey-strip" : "overview-modules");
  if (started) expect(order.afterShortcut).toBe("overview-modules");
  expect(order.afterModules).toBe("calendar-explorer");
  expect(order.noOverflow).toBeTruthy();
  await expect(page.locator(".pillar-card")).toHaveCount(0);
}
test("first visit and content browsing do not start the challenge", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "Próximo treino e progresso" }),
  ).toHaveCount(0);
  await expect(page.locator(".module-card")).toHaveCount(5);
  await checkOrder(page, false);
  await page.getByRole("link", { name: "CONTINUAR MEU DESAFIO" }).click();
  await expect(
    page.getByRole("button", { name: "Registrar início do treino" }),
  ).toBeVisible();
  await page.goto("/");
  await checkOrder(page, false);
  await page.goto("/#/aula/boas-vindas");
  await page
    .getByRole("button", { name: "Marcar orientação como lida" })
    .click();
  await page.goto("/");
  await page.reload();
  await expect(page.locator(".journey-strip")).toHaveCount(0);
  await checkOrder(page, false);
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    KEY,
  );
  expect(saved.challengeStarted).toBe(false);
  expect(saved.completed).toEqual([]);
  expect(saved.lessons).toEqual(["boas-vindas"]);
  await page.screenshot({
    path: `artifacts/${info.project.name}-visao-geral-primeiro-acesso.png`,
    fullPage: true,
  });
});
test("explicit start persists without completing a workout, then next workout advances", async ({
  page,
}, info) => {
  await page.goto("/#/treino/1");
  await page
    .getByRole("button", { name: "Registrar início do treino" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Início do desafio registrado",
  );
  await page.reload();
  await expect(page.getByRole("status")).toContainText(
    "Início do desafio registrado",
  );
  let saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    KEY,
  );
  expect(saved.challengeStarted).toBe(true);
  expect(saved.completed).toEqual([]);
  await page.goto("/");
  await checkOrder(page, true);
  await expect(page.locator(".journey-title")).toContainText("Treino 01");
  await page.screenshot({
    path: `artifacts/${info.project.name}-visao-geral-apos-inicio.png`,
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Abrir próximo treino", exact: true })
    .click();
  await expect(page).toHaveURL(/treino\/1$/);
  await page
    .getByRole("button", { name: "Marcar treino como concluído" })
    .click();
  await page.goto("/");
  await expect(page.locator(".journey-title")).toContainText("Treino 02");
  await checkOrder(page, true);
  await page.goto("/#/treino/1");
  await page.getByRole("button", { name: "Desfazer conclusão" }).click();
  await page.goto("/");
  await page.reload();
  await checkOrder(page, true);
  saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    KEY,
  );
  expect(saved.completed).toEqual([]);
  expect(saved.challengeStarted).toBe(true);
});
test("existing workout progress enables the shortcut and preserves earlier records", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key }) => {
      if (localStorage.getItem(key)) return;
      const day = new Date().toLocaleDateString("en-CA");
      localStorage.setItem(
        key,
        JSON.stringify({
          completed: ["treino-01"],
          lessons: ["pilares"],
          goal: 2000,
          water: {
            [day]: [{ id: "old-water-entry", amount: 250, time: "10:00" }],
          },
        }),
      );
    },
    { key: KEY },
  );
  await page.goto("/");
  await checkOrder(page, true);
  await expect(page.locator(".journey-title")).toContainText("Treino 02");
  await page.reload();
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    KEY,
  );
  expect(saved.challengeStarted).toBe(true);
  expect(saved.completed).toEqual(["treino-01"]);
  expect(saved.lessons).toEqual(["pilares"]);
  expect(saved.goal).toBe(2000);
  expect(Object.values(saved.water).flat()).toEqual([
    { id: "old-water-entry", amount: 250, time: "10:00" },
  ]);
});
