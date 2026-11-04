import { test, expect } from "@playwright/test";
test("portable HTML embeds assets and preserves navigation and progress", async ({
  page,
}) => {
  const requests = [];
  const errors = [];
  page.on("request", (r) => {
    if (/^https?:/.test(r.url()) && r.resourceType() !== "document") requests.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/15m36.html");
  await expect(page.locator("h1")).toContainText("SEU DESAFIO DE 21 DIAS");
  await expect(page.locator(".module-card")).toHaveCount(5);
  await page.getByRole("link", { name: "CONTINUAR MEU DESAFIO" }).click();
  await page
    .getByRole("button", { name: "Marcar treino como concluído" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Desfazer conclusão" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Desfazer conclusão" }).click();
  await expect(
    page.getByRole("button", { name: "Marcar treino como concluído" }),
  ).toBeVisible();
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
