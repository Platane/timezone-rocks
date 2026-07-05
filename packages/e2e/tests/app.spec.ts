import { expect, test, type Page } from "@playwright/test";

/** the visible name of each location row, in order */
const readListItemLabels = (page: Page) =>
  page
    .getByRole("listitem")
    .all()
    .then((items) =>
      Promise.all(
        items.map(async (item) => {
          const itemId = await item.getAttribute("id");
          return page.locator(`[for="${itemId}"]`).textContent();
        })
      )
    );

test("Should load the app", async ({ page }) => {
  page.on("console", (msg) => console.log(msg.text()));

  await page.goto("/");

  await test.step("loads the timezone lines", async () => {
    await expect(page.getByText("loading...")).not.toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(1);
  });

  await test.step("loads the 3d globe", async () => {
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
});

test("Should add, duplicate, persist and remove timezones", async ({
  page,
}) => {
  await page.goto("/");

  const searchInputLocator = page.getByPlaceholder(
    "Add your teammate's timezone"
  );

  await test.step("add two cities, one of them twice (duplicates allowed)", async () => {
    // search is async — wait for the suggestion before pressing Enter
    await searchInputLocator.fill("malmo");
    await expect(
      page.getByRole("button", { name: /Malmö/ }).first()
    ).toBeVisible();
    await searchInputLocator.press("Enter");

    await searchInputLocator.fill("goteborg");
    await page
      .getByRole("button", { name: /Göteborg/ })
      .first()
      .click();

    await searchInputLocator.fill("malmo");
    await expect(
      page.getByRole("button", { name: /Malmö/ }).first()
    ).toBeVisible();
    await searchInputLocator.press("Enter");

    await expect(page.getByRole("listitem")).toHaveCount(4);
    expect(await readListItemLabels(page)).toEqual([
      "Malmö",
      "Göteborg",
      "Malmö",
      "Stockholm",
    ]);
  });

  await test.step("a reload persists the pins", async () => {
    await page.reload();

    await expect(page.getByRole("listitem")).toHaveCount(4);
    expect(await readListItemLabels(page)).toEqual([
      "Malmö",
      "Göteborg",
      "Malmö",
      "Stockholm",
    ]);
  });

  await test.step("removing one Malmö removes only that pin (id, not key)", async () => {
    await page
      .getByText("Malmö", { exact: true })
      .first()
      .locator("..")
      .getByRole("button", { name: "remove location" })
      .click();
    await expect(page.getByRole("listitem")).toHaveCount(3);
    expect(await readListItemLabels(page)).toEqual([
      "Göteborg",
      "Malmö",
      "Stockholm",
    ]);

    await page
      .getByText("Stockholm", { exact: true })
      .first()
      .locator("..")
      .getByRole("button", { name: "remove location" })
      .click();
    await expect(page.getByRole("listitem")).toHaveCount(2);
    expect(await readListItemLabels(page)).toEqual(["Göteborg", "Malmö"]);
  });
});

test("Should set the date, move the slider and share the state", async ({
  page,
}) => {
  await page.goto("/");

  const searchInputLocator = page.getByPlaceholder(
    "Add your teammate's timezone"
  );
  const flyingDate = page.locator(`[data-test-id="flying-date"]`).first();
  const expectFlyingDate = (text: string) =>
    expect
      .poll(async () =>
        (await flyingDate.textContent())?.replaceAll(/\s/g, " ")
      )
      .toBe(text);

  await test.step("set a date from the date picker", async () => {
    await page.getByLabel("Open date picker").click();
    await page.getByLabel("date picker").fill("2024-02-01");
    await page.getByLabel("date picker").press("Enter");

    await expectFlyingDate("February 1 at 12:00 PM");
    await expect(page.getByLabel("avatar in the pose day")).toBeVisible();
  });

  await test.step("move the slider", async () => {
    const slider = page.getByLabel("date slider");
    await expect(slider).toBeVisible();

    const bb = (await slider.boundingBox())!;
    const y = bb.y + bb.height / 2;
    await page.mouse.move(bb.x + bb.width / 2, y);
    await page.mouse.down();
    await page.mouse.move(bb.x + bb.width / 2 + 310, y);
    await page.mouse.up();

    await expectFlyingDate("February 2 at 05:30 AM");
    await expect(page.getByLabel("avatar in the pose night")).toBeVisible();
  });

  await test.step("share the pins and time via url", async () => {
    // add a city so the share url carries multiple pins (wait for the async
    // suggestion before pressing Enter)
    await searchInputLocator.fill("malmo");
    await expect(
      page.getByRole("button", { name: /Malmö/ }).first()
    ).toBeVisible();
    await searchInputLocator.press("Enter");
    await expect(page.getByRole("listitem")).toHaveCount(2);

    // the share url encodes the pins and the selected time (unlike the address
    // bar hash, which intentionally omits the time)
    const shareUrl = await page.getByTitle("share link").getAttribute("href");

    // loading it restores the pins and the time
    await page.goto(shareUrl!);

    await expect(page.getByRole("listitem")).toHaveCount(2);
    expect(await readListItemLabels(page)).toEqual(["Malmö", "Stockholm"]);
    await expectFlyingDate("February 2 at 05:30 AM");
  });
});
