import { expect, test } from "@playwright/test";

test("Should open the about modal", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Attribution")).not.toBeVisible();

  await page.getByTitle("about").click();
  expect(page.url()).toContain("/about");

  await expect(page.getByText("Attribution")).toBeVisible();
});

test("Should open the avatar app", async ({ page }) => {
  await page.goto("/");

  await page.getByTitle("avatar animation").click();
  expect(page.url()).toContain("/avatar");

  await expect(page.getByText("Avatar pose")).toBeVisible();

  await page.goBack();

  await expect(page.getByText("Avatar pose")).not.toBeVisible();
});
