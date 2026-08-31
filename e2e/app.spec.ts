import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("browses all documented drinks and opens a traceable recipe", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Thực đơn trà trái cây" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Nhiệt đới/ })).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Tìm món" }).fill("ổi hồng");
  await expect(page.getByRole("button", { name: /Ổi hồng/ })).toBeVisible();
  await page.getByRole("button", { name: /Ổi hồng/ }).click();
  await expect(page.getByRole("dialog", { name: "Ổi hồng" })).toBeVisible();
  await expect(page.getByText(/CACH PHA CHE TRA/)).toBeVisible();
  await expect(page.getByText("100 ml", { exact: true })).toBeVisible();
});

test("calculates a prepared batch and keeps excluded service costs out", async ({ page }) => {
  await page.getByRole("button", { name: "Mẻ nguyên liệu" }).click();
  await page.getByLabel("Chọn mẻ cần tính").selectOption("mang-cau");
  await page.getByLabel("Quy cách mua Mãng cầu đã sơ chế").fill("1000");
  await page.getByLabel("Giá mua Mãng cầu đã sơ chế").fill("50000");
  await page.getByLabel("Quy cách mua Đường").fill("1000");
  await page.getByLabel("Giá mua Đường").fill("20000");
  await page.getByLabel("Sản lượng thành phẩm").fill("1120");
  await page.getByLabel("Đơn vị thành phẩm").selectOption("ml");
  await expect(page.getByText("Tổng cost mẻ").locator("..")).toContainText("56.000 đ");
  await expect(page.getByText("Cost / ml").locator("..")).toContainText("50 đ");
  await expect(page.getByText(/Không gồm trà, đá, ly, nắp, ống hút/)).toBeVisible();
});

test("calculates one complete cup with an itemized seasonal price breakdown", async ({ page }) => {
  await page.getByRole("button", { name: "Một ly" }).click();
  await page.getByLabel("Chọn món cần tính").selectOption("me-dac");
  await page.getByLabel("Đơn giá Cốt me đậm vị").fill("10");
  await page.getByLabel("Đơn giá Trà đã ủ").fill("1");
  await page.getByLabel("Đơn giá Đác rim me").fill("100");
  await page.getByLabel("Đơn giá Đậu phộng").fill("500");
  await page.getByRole("spinbutton", { name: "Đơn giá Đá đ", exact: true }).fill("100");
  await page.getByLabel("Đơn giá Ly + nắp").fill("1200");
  await page.getByLabel("Đơn giá Ống hút").fill("100");
  await expect(page.getByText("Tổng cost 1 ly").locator("..")).toContainText("4.100 đ");
  await expect(page.getByText("Đã đủ giá đang chọn")).toBeVisible();
  const history = page.getByRole("region", { name: "Lịch sử cost · Me đác đậm vị" });
  await history.getByRole("button", { name: "Lưu cost hiện tại" }).click();
  await expect(history.getByText("4.100 đ")).toBeVisible();
  await page.getByLabel("Đơn giá Ly + nắp").fill("1000");
  await expect(page.getByText("Tổng cost 1 ly").locator("..")).toContainText("3.900 đ");
  await history.getByRole("button", { name: "Lưu cost hiện tại" }).click();
  await expect(history.getByText("Giảm 200 đ")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Một ly" }).click();
  await page.getByLabel("Chọn món cần tính").selectOption("me-dac");
  await expect(page.getByLabel("Đơn giá Ly + nắp")).toHaveValue("1000");
  await expect(page.getByRole("region", { name: "Lịch sử cost · Me đác đậm vị" })).toContainText(
    "Giảm 200 đ",
  );
});

test("reloads the cached app shell while offline", async ({ page, context }) => {
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Thực đơn trà trái cây" })).toBeVisible();
});
