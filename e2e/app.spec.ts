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
  await page.getByLabel("Lượng dùng cho mẻ Mãng cầu đã sơ chế").fill("1000");
  await page.getByLabel("Tổng tiền cho mẻ Mãng cầu đã sơ chế").fill("50000");
  await page.getByLabel("Lượng dùng cho mẻ Đường").fill("1000");
  await page.getByLabel("Giá mua / kg Đường").fill("20000");
  await page.getByLabel("Sản lượng thành phẩm").fill("1120");
  await page.getByLabel("Đơn vị thành phẩm").selectOption("ml");
  await expect(page.getByText("Tổng cost mẻ").locator("..")).toContainText("70.000 đ");
  await expect(page.getByText(/Cost \/ ml/)).toHaveCount(0);
  await expect(page.getByText(/Không gồm trà, đá, ly, nắp, ống hút/)).toBeVisible();
});

test("separates tropical fruit costs and prices sugar by the kilogram", async ({ page }) => {
  await page.getByRole("button", { name: "Mẻ nguyên liệu" }).click();
  const hardFruitGroup = page.getByRole("group", { name: "Trái cây cứng hỗn hợp" });
  await expect(hardFruitGroup).toBeVisible();
  await expect(hardFruitGroup.getByRole("article")).toHaveCount(6);
  const fruitCosts = [
    ["Dưa lưới", "2", "kg", "60000"],
    ["Xoài", "1.5", "kg", "50000"],
    ["Ổi", "1.2", "kg", "30000"],
    ["Mận", "1", "kg", "30000"],
    ["Đào trơn ruột vàng", "0.8", "kg", "30000"],
    ["Dâu tây", "250", "g", "20000"],
  ] as const;
  for (const [name, quantity, unit, cost] of fruitCosts) {
    await page.getByLabel(`Lượng dùng cho mẻ ${name}`).fill(quantity);
    await page.getByLabel(`Đơn vị dùng ${name}`).selectOption(unit);
    await page.getByLabel(`Tổng tiền cho mẻ ${name}`).fill(cost);
  }
  await page.getByLabel("Lượng dùng cho mẻ Đường").fill("3.3");
  await page.getByLabel("Đơn vị dùng Đường").selectOption("kg");
  await page.getByLabel("Giá mua / kg Đường").fill("106000");

  await expect(page.getByRole("article").filter({ hasText: "Dưa lưới" })).toContainText("60.000 đ");
  await expect(page.getByRole("article").filter({ hasText: "Đường" })).toContainText("349.800 đ");
  await expect(page.getByText("Tổng cost mẻ").locator("..")).toContainText("569.800 đ");
  await expect(hardFruitGroup).toContainText("6 loại · nhập chi phí riêng");
  await expect(page.getByText(/^Cần /)).toHaveCount(0);

  await page.getByLabel("Chọn mẻ cần tính").selectOption("mang-cau");
  await expect(page.getByLabel("Lượng dùng cho mẻ Đường")).toHaveValue("");
  await expect(page.getByLabel("Giá mua / kg Đường")).toHaveValue("");
  await page.getByLabel("Chọn mẻ cần tính").selectOption("nhiet-doi");
  await expect(page.getByLabel("Lượng dùng cho mẻ Đường")).toHaveValue("3.3");
  await expect(page.getByLabel("Giá mua / kg Đường")).toHaveValue("106000");
});

test("prices a smoothie from a one-liter bottle and milliliters used", async ({ page }) => {
  await page.getByRole("button", { name: "Mẻ nguyên liệu" }).click();
  await page.getByLabel("Giá mua chai 1 lít Sinh tố xoài Berino").fill("180000");
  await page.getByLabel("Lượng dùng cho mẻ Sinh tố xoài Berino").fill("25");

  await expect(page.getByRole("article").filter({ hasText: "Sinh tố xoài Berino" })).toContainText(
    "4.500 đ",
  );
  await expect(page.getByText(/Cost \/ g/)).toHaveCount(0);

  await page.reload();
  await page.getByRole("button", { name: "Mẻ nguyên liệu" }).click();
  await expect(page.getByLabel("Giá mua chai 1 lít Sinh tố xoài Berino")).toHaveValue("180000");
  await expect(page.getByLabel("Lượng dùng cho mẻ Sinh tố xoài Berino")).toHaveValue("25");
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
  await page.getByRole("button", { name: "Lịch sử" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: "Lịch sử cost" })).toBeVisible();
  await expect(page.getByLabel("Lọc lịch sử theo món")).toHaveValue("all");
  await expect(page.getByRole("region", { name: "Các lần chốt cost" })).toContainText(
    "Me đác đậm vị",
  );
  await expect(page.getByRole("region", { name: "Các lần chốt cost" })).toContainText("Giảm 200 đ");
});

test("reloads the cached app shell while offline", async ({ page, context }) => {
  await page.evaluate(async () => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Thực đơn trà trái cây" })).toBeVisible();
});
