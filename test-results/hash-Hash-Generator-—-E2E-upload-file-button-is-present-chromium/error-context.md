# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hash.spec.ts >> Hash Generator — E2E >> upload file button is present
- Location: src/e2e/hash.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('input[type="file"]')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="file"]')
    14 × locator resolved to <input type="file" class="hidden"/>
       - unexpected value "hidden"

```

```yaml
- main:
  - heading "Hash Generator" [level=1]
  - paragraph:
    - text: Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Part of the
    - link "freeq.one":
      - /url: https://freeq.one
    - text: tools suite.
  - text: Input Text
  - textbox "Enter text to hash..."
  - button "Generate Hashes" [disabled]
  - text: Upload File
  - heading "History" [level=2]
  - text: No history yet
  - paragraph:
    - text: Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Part of the
    - link "freeq.one":
      - /url: https://freeq.one
    - text: tools suite.
- region "Notifications Alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Hash Generator — E2E", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  |   });
  7  | 
  8  |   test("page loads with correct title", async ({ page }) => {
  9  |     await expect(page.locator("h1")).toHaveText("Hash Generator");
  10 |   });
  11 | 
  12 |   test("generates hashes for text input", async ({ page }) => {
  13 |     const textarea = page.locator("textarea");
  14 |     await textarea.fill("hello");
  15 |     await page.getByRole("button", { name: "Generate Hashes" }).click();
  16 |     await expect(page.getByText("MD5")).toBeVisible();
  17 |     await expect(page.getByText("SHA-1")).toBeVisible();
  18 |     await expect(page.getByText("SHA-256")).toBeVisible();
  19 |     await expect(page.getByText("SHA-512")).toBeVisible();
  20 |     await expect(page.getByText("5d41402abc4b2a76b9719d911017c592")).toBeVisible();
  21 |   });
  22 | 
  23 |   test("copy buttons exist for each hash", async ({ page }) => {
  24 |     const textarea = page.locator("textarea");
  25 |     await textarea.fill("test");
  26 |     await page.getByRole("button", { name: "Generate Hashes" }).click();
  27 |     const copyButtons = page.getByTitle("Copy HEX");
  28 |     const count = await copyButtons.count();
  29 |     expect(count).toBe(4);
  30 |   });
  31 | 
  32 |   test("clear button resets the form", async ({ page }) => {
  33 |     const textarea = page.locator("textarea");
  34 |     await textarea.fill("hello");
  35 |     await page.getByRole("button", { name: "Generate Hashes" }).click();
  36 |     await expect(page.getByText("MD5")).toBeVisible();
  37 |     await page.getByRole("button", { name: /Clear/ }).click();
  38 |     await expect(page.getByText("MD5")).not.toBeVisible();
  39 |     await expect(textarea).toHaveValue("");
  40 |   });
  41 | 
  42 |   test("upload file button is present", async ({ page }) => {
> 43 |     await expect(page.locator('input[type="file"]')).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  44 |   });
  45 | 
  46 |   test.describe("Hash comparison", () => {
  47 |     test("shows match when hash matches", async ({ page }) => {
  48 |       const textarea = page.locator("textarea");
  49 |       await textarea.fill("hello");
  50 |       await page.getByRole("button", { name: "Generate Hashes" }).click();
  51 |       await page.getByText("Hash Comparison").click();
  52 |       const compareInput = page.locator('input[placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"]');
  53 |       await compareInput.fill("5d41402abc4b2a76b9719d911017c592");
  54 |       await page.getByRole("button", { name: "Compare" }).click();
  55 |       await expect(page.getByText("Match")).toBeVisible();
  56 |     });
  57 | 
  58 |     test("shows no match when hash does not match", async ({ page }) => {
  59 |       const textarea = page.locator("textarea");
  60 |       await textarea.fill("hello");
  61 |       await page.getByRole("button", { name: "Generate Hashes" }).click();
  62 |       await page.getByText("Hash Comparison").click();
  63 |       const compareInput = page.locator('input[placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"]');
  64 |       await compareInput.fill("00000000000000000000000000000000");
  65 |       await page.getByRole("button", { name: "Compare" }).click();
  66 |       await expect(page.getByText("No Match")).toBeVisible();
  67 |     });
  68 |   });
  69 | 
  70 |   test.describe("History feature", () => {
  71 |     test.beforeEach(async ({ page }) => {
  72 |       await page.evaluate(() => localStorage.clear());
  73 |       await page.reload();
  74 |     });
  75 | 
  76 |     test("after generating hashes, history entry appears with HASH badge", async ({ page }) => {
  77 |       const textarea = page.locator("textarea");
  78 |       await textarea.fill("hello");
  79 |       await page.getByRole("button", { name: "Generate Hashes" }).click();
  80 |       await expect(page.getByText("No history yet")).not.toBeVisible();
  81 |       await expect(page.getByText("HASH", { exact: true })).toBeVisible();
  82 |     });
  83 | 
  84 |     test("clear all removes all history entries", async ({ page }) => {
  85 |       const textarea = page.locator("textarea");
  86 |       await textarea.fill("hello");
  87 |       await page.getByRole("button", { name: "Generate Hashes" }).click();
  88 |       await expect(page.getByText("HASH", { exact: true })).toBeVisible();
  89 |       await page.getByRole("button", { name: "Clear All" }).click();
  90 |       await expect(page.getByText("No history yet", { exact: true })).toBeVisible();
  91 |     });
  92 |   });
  93 | });
  94 | 
```