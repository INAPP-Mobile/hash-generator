import { test, expect } from "@playwright/test";

test.describe("Hash Generator — E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Hash Generator");
  });

  test("generates hashes for text input", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.fill("hello");
    await page.getByRole("button", { name: "Generate Hashes" }).click();
    await expect(page.getByText("MD5")).toBeVisible();
    await expect(page.getByText("SHA-1")).toBeVisible();
    await expect(page.getByText("SHA-256")).toBeVisible();
    await expect(page.getByText("SHA-512")).toBeVisible();
    await expect(page.getByText("5d41402abc4b2a76b9719d911017c592")).toBeVisible();
  });

  test("copy buttons exist for each hash", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.fill("test");
    await page.getByRole("button", { name: "Generate Hashes" }).click();
    const copyButtons = page.getByTitle("Copy HEX");
    const count = await copyButtons.count();
    expect(count).toBe(4);
  });

  test("clear button resets the form", async ({ page }) => {
    const textarea = page.locator("textarea");
    await textarea.fill("hello");
    await page.getByRole("button", { name: "Generate Hashes" }).click();
    await expect(page.getByText("MD5")).toBeVisible();
    await page.getByRole("button", { name: /Clear/ }).click();
    await expect(page.getByText("MD5")).not.toBeVisible();
    await expect(textarea).toHaveValue("");
  });

  test("upload file button is present", async ({ page }) => {
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test.describe("Hash comparison", () => {
    test("shows match when hash matches", async ({ page }) => {
      const textarea = page.locator("textarea");
      await textarea.fill("hello");
      await page.getByRole("button", { name: "Generate Hashes" }).click();
      await page.getByText("Hash Comparison").click();
      const compareInput = page.locator('input[placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"]');
      await compareInput.fill("5d41402abc4b2a76b9719d911017c592");
      await page.getByRole("button", { name: "Compare" }).click();
      await expect(page.getByText("Match")).toBeVisible();
    });

    test("shows no match when hash does not match", async ({ page }) => {
      const textarea = page.locator("textarea");
      await textarea.fill("hello");
      await page.getByRole("button", { name: "Generate Hashes" }).click();
      await page.getByText("Hash Comparison").click();
      const compareInput = page.locator('input[placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"]');
      await compareInput.fill("00000000000000000000000000000000");
      await page.getByRole("button", { name: "Compare" }).click();
      await expect(page.getByText("No Match")).toBeVisible();
    });
  });

  test.describe("History feature", () => {
    test.beforeEach(async ({ page }) => {
      await page.evaluate(() => localStorage.clear());
      await page.reload();
    });

    test("after generating hashes, history entry appears with HASH badge", async ({ page }) => {
      const textarea = page.locator("textarea");
      await textarea.fill("hello");
      await page.getByRole("button", { name: "Generate Hashes" }).click();
      await expect(page.getByText("No history yet")).not.toBeVisible();
      await expect(page.getByText("HASH", { exact: true })).toBeVisible();
    });

    test("clear all removes all history entries", async ({ page }) => {
      const textarea = page.locator("textarea");
      await textarea.fill("hello");
      await page.getByRole("button", { name: "Generate Hashes" }).click();
      await expect(page.getByText("HASH", { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Clear All" }).click();
      await expect(page.getByText("No history yet", { exact: true })).toBeVisible();
    });
  });
});
