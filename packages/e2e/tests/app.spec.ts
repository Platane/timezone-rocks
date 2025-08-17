import { expect, test } from "@playwright/test";

test("Should load timezone lines", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("loading...")).not.toBeVisible();

  await expect(page.getByRole("listitem")).toHaveCount(1);
});

test("Should load 3d globe", async ({ page, browserName }) => {
  page.on("console", (msg) => console.log(msg.text()));

  await page.goto("/");

  await page.waitForSelector("canvas");

  await page.screenshot({
    fullPage: true,
    path: "playwright-screenshots/page-canvas-loaded.png",
  });

  await page.waitForTimeout(500);

  await page.screenshot({
    fullPage: true,
    path: "playwright-screenshots/page-stable.png",
  });
});

test("Should be able to add timezone", async ({ page }) => {
  await page.goto("/");

  const searchInputLocator = page.getByPlaceholder(
    "Add your teammate's timezone"
  );

  await searchInputLocator.fill("malmo");
  await searchInputLocator.press("Enter");

  await expect(page.getByRole("listitem")).toHaveCount(2);

  const itemLabels = await page
    .getByRole("listitem")
    .all()
    .then((items) =>
      Promise.all(
        items.map(async (item) => {
          const itemId = await item.getAttribute("id");

          const label = await page.locator(`[for="${itemId}"]`).textContent();

          return label;
        })
      )
    );

  expect(itemLabels).toEqual(["Malmö", "Stockholm"]);
});

test("Should be able to move slider", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Open date picker").click();
  await page.getByLabel("date picker").fill("2024-02-01");
  await page.getByLabel("date picker").press("Enter");

  const flyingDateLocator = page.locator(`[data-test-id="flying-date"]`);

  {
    const date = await flyingDateLocator.textContent();
    expect(date?.replaceAll(/\s/g, " ")).toBe("February 1 at 12:00 PM");
  }

  await expect(page.getByLabel("avatar in the pose day")).toBeVisible();

  // slide 300px left
  {
    const sliderLocator = page.getByLabel("date slider");

    await expect(sliderLocator).toBeVisible();

    const bb0 = (await sliderLocator.boundingBox())!;
    const p0 = { x: bb0.x + bb0.width / 2, y: bb0.y + bb0.height / 2 };

    await page.mouse.move(p0.x, p0.y);
    await page.mouse.down();
    await page.mouse.move(p0.x + 310, p0.y);
    await page.mouse.up();
  }

  {
    const date = await flyingDateLocator.textContent();
    expect(date?.replaceAll(/\s/g, " ")).toBe("February 2 at 05:30 AM");
  }

  await expect(page.getByLabel("avatar in the pose night")).toBeVisible();
});
