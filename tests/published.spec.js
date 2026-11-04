import { test, expect } from "@playwright/test";
test("public preview opens without login and supports member interactions", async ({
  page,
}, info) => {
  test.skip(
    !process.env.PUBLIC_PREVIEW_URL,
    "Somente para a publicação pública real.",
  );
  const errors = [];
  const failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  const response = await page.goto(process.env.PUBLIC_PREVIEW_URL);
  expect(response.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("SEU DESAFIO DE 21 DIAS");
  await expect(page.locator(".module-card")).toHaveCount(5);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `artifacts/${info.project.name}-publicado.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "CONTINUAR MEU DESAFIO" }).click();
  await page
    .getByRole("button", { name: "Marcar treino como concluído" })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Desfazer conclusão" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Desfazer conclusão" }).click();
  await page.goto(process.env.PUBLIC_PREVIEW_URL + "#/hidratacao");
  await page.getByLabel("Meta diária em mL").fill("2000");
  await page.getByRole("button", { name: "Salvar meta" }).click();
  await page.getByLabel("Quantidade consumida em mL").fill("250");
  await page.getByRole("button", { name: "Registrar", exact: true }).click();
  await page.reload();
  await expect(page.locator(".water-orbit strong")).toContainText("250");
  await page
    .getByRole("button", { name: "Corrigir registro de 250 mL" })
    .click();
  await page.getByLabel("Quantidade consumida em mL").fill("400");
  await page.getByRole("button", { name: "Salvar correção" }).click();
  await page
    .getByRole("button", { name: "Remover registro de 400 mL" })
    .click();
  await expect(page.locator(".water-entry")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
