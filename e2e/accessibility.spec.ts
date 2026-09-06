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

  await page.getByLabel("Chọn mẻ cần tính").selectOption("mang-cau");
  await page.getByLabel("Lượng dùng cho mẻ Mãng cầu đã sơ chế").fill("1000");
  await page.getByLabel("Tổng tiền cho mẻ Mãng cầu đã sơ chế").fill("50000");
  await page
    .getByRole("region", { name: "Lịch sử cost mẻ · Mãng cầu ủ đường" })
    .getByRole("button", { name: "Lưu cost mẻ hiện tại" })
    .click();
  await page.getByRole("button", { name: "Lịch sử", exact: true }).click();
  await page.getByRole("button", { name: /Xem đầy đủ cost mẻ Mãng cầu ủ đường/ }).click();
  await expectAccessible(page, "history detail dialog");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("button", { name: "Một ly", exact: true }).click();
  await expectAccessible(page, "finished cup calculator");

  await page.getByRole("button", { name: "Lịch sử" }).click();
  await expectAccessible(page, "cost history");

  await page.getByRole("button", { name: "Cài đặt" }).click();
  await expectAccessible(page, "settings");
});
