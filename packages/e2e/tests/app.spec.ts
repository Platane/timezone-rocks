import { test, expect } from "@playwright/test";

test.describe("App", () => {
  test("Should load", async ({ page }) => {
    page.on("console", (msg) => console.log(msg.text()));

    await page.goto("/");

    await page.screenshot({
      fullPage: true,
      path: "playwright-screenshots/page0.png",
    });

    await page.waitForSelector("canvas");

    await page.screenshot({
      fullPage: true,
      path: "playwright-screenshots/page-loaded.png",
    });

    await page.waitForTimeout(5000);

    await page.screenshot({
      fullPage: true,
      path: "playwright-screenshots/page-stable.png",
    });
  });

  // test("Should be able to add timezone", async ({ page }) => {
  //   await page.goto("/");

  //   await page.getByPlaceholder("Add your teammate's timezone").fill("malmo");
  //   await page.getByPlaceholder("Add your teammate's timezone").press("Enter");

  //   await expect(page.getByRole("listitem")).toHaveCount(2);
  // });
});
