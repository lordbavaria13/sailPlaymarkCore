import { test, expect, Page } from "@playwright/test";

const generateUser = () => {
  const id = Date.now().toString() + Math.random().toString().slice(2, 5);
  return {
    username: `user${id}`,
    email: `k${id}@example.com`,
    password: "secretpassword",
  };
};

async function signupAndLogin(page: Page, user: ReturnType<typeof generateUser>) {
  await page.goto("/");
  // Signup
  await page.click("a[href=\"/signup\"]");
  await page.fill("input[name=\"username\"]", user.username);
  await page.fill("input[name=\"email\"]", user.email);
  await page.fill("input[name=\"password\"]", user.password);
  await page.click("button:has-text(\"Submit\")");
  await expect(page).toHaveTitle(/Welcome/);

  // Login
  await page.click("a[href=\"/login\"]");
  await page.fill("input[name=\"username\"]", user.username);
  await page.fill("input[name=\"password\"]", user.password);
  await page.click("button:has-text(\"Submit\")");
  await expect(page).toHaveTitle(/Sailing Dashboard/);
}

test.describe("Placemark Privacy & Visibility", () => {
    
  test("Private placemarks should not be visible to other users", async ({ browser }) => {
    // 1. Create User A
    const userA = generateUser();
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await signupAndLogin(pageA, userA);

    // 2. User A creates a PRIVATE placemark
    const privateTitle = `Secret ${Date.now()}`;
    await pageA.fill("input[name=\"title\"]", privateTitle);
    await pageA.click("button:has-text(\"Add Placemark\")");
    
    // Ensure it exists for User A
    await expect(pageA.locator(".box .title").filter({ hasText: privateTitle })).toBeVisible();

    // 3. User A creates a PUBLIC placemark
    const publicTitle = `Public ${Date.now()}`;
    await pageA.fill("input[name=\"title\"]", publicTitle);
    await pageA.click("button:has-text(\"Add Placemark\")");
    
    // Go to details first, then edit
    const publicBox = pageA.locator(".box", { hasText: publicTitle });
    await publicBox.locator("a[href*=\"/dashboard/placemark/\"]").click();
    await pageA.click("a[href*=\"/dashboard/edit/\"]");
    
    // Select "Public"
    const publicRadio = pageA.getByLabel("Public");
      await publicRadio.check();

  await expect(publicRadio).toBeChecked();
    await pageA.click("button:has-text(\"Add Details\")");

    await pageA.close();

    // 4. Create User B
    const userB = generateUser();
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await signupAndLogin(pageB, userB);

    // 5. User B should verify visibility
    // Should NOT see Private Title
    await expect(pageB.locator(".box .title").filter({ hasText: privateTitle })).not.toBeVisible();

    // Should SEE Public Title
    await expect(pageB.locator(".box .title").filter({ hasText: publicTitle })).toBeVisible();

    await pageB.close();
  });

});
