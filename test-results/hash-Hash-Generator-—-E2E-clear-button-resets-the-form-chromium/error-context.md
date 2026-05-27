# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hash.spec.ts >> Hash Generator — E2E >> clear button resets the form
- Location: src/e2e/hash.spec.ts:32:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('MD5')
Expected: visible
Error: strict mode violation: getByText('MD5') resolved to 4 elements:
    1) <p class="text-center text-gray-400 mb-8 text-sm">…</p> aka getByText('Generate MD5, SHA1, SHA256,').first()
    2) <span class="text-xs font-semibold text-blue-400 uppercase tracking-wider">MD5</span> aka getByText('MD5', { exact: true })
    3) <span class="text-[10px] text-gray-500 ml-1">→ MD5: 5d41402abc4b2a76...</span> aka getByText('→ MD5: 5d41402abc4b2a76...')
    4) <p>…</p> aka getByText('Generate MD5, SHA1, SHA256,').nth(1)

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('MD5')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - heading "Hash Generator" [level=1] [ref=e4]
      - paragraph [ref=e5]:
        - text: Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Part of the
        - link "freeq.one" [ref=e6] [cursor=pointer]:
          - /url: https://freeq.one
        - text: tools suite.
      - generic [ref=e7]:
        - generic [ref=e8]:
          - generic [ref=e9]:
            - img [ref=e10]
            - generic [ref=e13]: Input Text
          - textbox "Enter text to hash..." [ref=e14]: hello
          - generic [ref=e15]:
            - button "Generate Hashes" [ref=e16]:
              - img [ref=e17]
              - text: Generate Hashes
            - generic [ref=e20] [cursor=pointer]:
              - img [ref=e21]
              - text: Upload File
            - button "Clear" [ref=e24]:
              - img [ref=e25]
              - text: Clear
        - generic [ref=e28]:
          - heading "Generated Hashes" [level=2] [ref=e29]
          - generic [ref=e30]:
            - generic [ref=e31]:
              - generic [ref=e32]:
                - generic [ref=e33]: MD5
                - generic [ref=e34]: 16 bytes
              - generic [ref=e35]:
                - generic [ref=e36]:
                  - generic [ref=e37]: HEX
                  - code [ref=e38]: 5d41402abc4b2a76b9719d911017c592
                  - button "Copy HEX" [ref=e39]:
                    - img [ref=e40]
                - generic [ref=e43]:
                  - generic [ref=e44]: B64
                  - code [ref=e45]: XUFAKrxLKna5cZ2REBfFkg==
                  - button "Copy Base64" [ref=e46]:
                    - img [ref=e47]
            - generic [ref=e50]:
              - generic [ref=e51]:
                - generic [ref=e52]: SHA-1
                - generic [ref=e53]: 20 bytes
              - generic [ref=e54]:
                - generic [ref=e55]:
                  - generic [ref=e56]: HEX
                  - code [ref=e57]: aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
                  - button "Copy HEX" [ref=e58]:
                    - img [ref=e59]
                - generic [ref=e62]:
                  - generic [ref=e63]: B64
                  - code [ref=e64]: qvTGHdzF6KLavt4PO0gs2a6pQ00=
                  - button "Copy Base64" [ref=e65]:
                    - img [ref=e66]
            - generic [ref=e69]:
              - generic [ref=e70]:
                - generic [ref=e71]: SHA-256
                - generic [ref=e72]: 32 bytes
              - generic [ref=e73]:
                - generic [ref=e74]:
                  - generic [ref=e75]: HEX
                  - code [ref=e76]: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
                  - button "Copy HEX" [ref=e77]:
                    - img [ref=e78]
                - generic [ref=e81]:
                  - generic [ref=e82]: B64
                  - code [ref=e83]: LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=
                  - button "Copy Base64" [ref=e84]:
                    - img [ref=e85]
            - generic [ref=e88]:
              - generic [ref=e89]:
                - generic [ref=e90]: SHA-512
                - generic [ref=e91]: 64 bytes
              - generic [ref=e92]:
                - generic [ref=e93]:
                  - generic [ref=e94]: HEX
                  - code [ref=e95]: 9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043
                  - button "Copy HEX" [ref=e96]:
                    - img [ref=e97]
                - generic [ref=e100]:
                  - generic [ref=e101]: B64
                  - code [ref=e102]: m3HSJL1i83hdltRq0+o9czGb+8KJDKra4t/3JRlnPKcjI8PZm6XBHXx6zG4UuMXaDEZjR1wuXDre9G9zvN7AQw==
                  - button "Copy Base64" [ref=e103]:
                    - img [ref=e104]
        - button "Hash Comparison ▼" [ref=e109]:
          - img [ref=e110]
          - text: Hash Comparison
          - generic [ref=e113]: ▼
      - generic [ref=e114]:
        - generic [ref=e115]:
          - heading "History" [level=2] [ref=e116]:
            - img [ref=e117]
            - text: History
          - button "Clear All" [ref=e121]:
            - img [ref=e122]
            - text: Clear All
        - generic [ref=e126]:
          - button "Pin" [ref=e127]:
            - img [ref=e128]
          - generic [ref=e130]:
            - generic [ref=e131]:
              - generic [ref=e132]: HASH
              - generic [ref=e133]: hello
            - generic [ref=e134]:
              - img [ref=e135]
              - generic [ref=e138]: just now
              - generic [ref=e139]: "→ MD5: 5d41402abc4b2a76..."
          - button "Delete" [ref=e140]:
            - img [ref=e141]
      - paragraph [ref=e145]:
        - text: Generate MD5, SHA1, SHA256, SHA512 hashes instantly. Part of the
        - link "freeq.one" [ref=e146] [cursor=pointer]:
          - /url: https://freeq.one
        - text: tools suite.
  - region "Notifications Alt+T"
  - generic [ref=e151] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e152]:
      - img [ref=e153]
    - generic [ref=e156]:
      - button "Open issues overlay" [ref=e157]:
        - generic [ref=e158]:
          - generic [ref=e159]: "0"
          - generic [ref=e160]: "1"
        - generic [ref=e161]: Issue
      - button "Collapse issues badge" [ref=e162]:
        - img [ref=e163]
  - alert [ref=e165]
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
> 36 |     await expect(page.getByText("MD5")).toBeVisible();
     |                                         ^ Error: expect(locator).toBeVisible() failed
  37 |     await page.getByRole("button", { name: /Clear/ }).click();
  38 |     await expect(page.getByText("MD5")).not.toBeVisible();
  39 |     await expect(textarea).toHaveValue("");
  40 |   });
  41 | 
  42 |   test("upload file button is present", async ({ page }) => {
  43 |     await expect(page.locator('input[type="file"]')).toBeVisible();
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