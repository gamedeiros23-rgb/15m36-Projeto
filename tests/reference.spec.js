import { test, expect } from "@playwright/test";
test("reference module covers and interactive 21-day explorer", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator(".module-cover")).toHaveCount(5);
  await expect(page.locator(".method-facts")).toContainText("9");
  const explorer = page.getByRole("region", { name: "Explorar os 21 dias" });
  await expect(explorer.getByRole("button", { name: /^Dia \d+:/ })).toHaveCount(
    21,
  );
  await explorer
    .getByRole("button", { name: "Dia 8: Treino 04", exact: true })
    .click();
  await expect(explorer.locator(".day-details")).toContainText(
    "ACELERAR · Dia de treino",
  );
  await expect(
    explorer.getByRole("button", { name: "Dia 8: Treino 04", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await explorer
    .getByRole("button", { name: "Próximo dia", exact: true })
    .click();
  await expect(explorer.locator(".day-details")).toContainText(
    "Dia de recuperação",
  );
  await explorer
    .getByRole("button", { name: "Dia anterior", exact: true })
    .click();
  await explorer.getByRole("link", { name: "Conhecer treino 04" }).click();
  await expect(page).toHaveURL(/treino\/4$/);
  await expect(
    page.getByRole("button", { name: "Marcar treino como concluído" }),
  ).toBeVisible();
  await page.goto("/#/calendario");
  const calendar = page.getByRole("region", { name: "Explorar os 21 dias" });
  await calendar
    .getByRole("button", { name: "Dia 21: Encerramento e recuperação" })
    .click();
  await calendar.getByRole("link", { name: "Abrir encerramento" }).click();
  await expect(page.locator("h1")).toHaveText("Dia 21 · Encerramento");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("15m36:member:v1")).completed,
    ),
  ).toEqual([]);
  await page.goto("/#/aula/bonus-alimentar");
  await page
    .getByRole("button", { name: "Marcar orientação como lida" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Desfazer leitura" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("15m36:member:v1")).completed,
    ),
  ).toEqual([]);
  await page
    .getByRole("link", { name: "Voltar ao módulo", exact: true })
    .click();
  await expect(page).toHaveURL(/modulo\/alimentacao$/);
  await page.goto("/");
  await page.screenshot({
    path: `artifacts/${info.project.name}-modelo-video.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
