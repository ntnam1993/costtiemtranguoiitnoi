import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const expectAccessible = async (page: Parameters<typeof AxeBuilder>[0]["page"], state: string) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations, `${state}: ${JSON.stringify(results.violations)}`).toEqual([]);
};

test("keeps every primary mobile surface free of WCAG A/AA violations", async ({ page }) => {
  await page.goto("/");
  await expectAccessible(page, "menu");

  await page.getByRole("button", { name: /Ổi hồng/ }).click();
  await expectAccessible(page, "recipe dialog");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("button", { name: "Mẻ nguyên liệu" }).click();
  await expectAccessible(page, "prepared batch calculator");

  await page.getByRole("button", { name: "Một ly" }).click();
  await expectAccessible(page, "finished cup calculator");

  await page.getByRole("button", { name: "Lịch sử" }).click();
  await expectAccessible(page, "cost history");

  await page.getByRole("button", { name: "Cài đặt" }).click();
  await expectAccessible(page, "settings");
});
