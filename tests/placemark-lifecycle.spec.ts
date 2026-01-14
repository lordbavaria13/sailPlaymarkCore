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
  await page.click("a[href=\"/signup\"]");
  await page.fill("input[name=\"username\"]", user.username);
  await page.fill("input[name=\"email\"]", user.email);
  await page.fill("input[name=\"password\"]", user.password);
  await page.click("button:has-text(\"Submit\")");
  
  await expect(page).toHaveTitle(/Welcome/);

  await page.click("a[href=\"/login\"]");
  await page.fill("input[name=\"username\"]", user.username);
  await page.fill("input[name=\"password\"]", user.password);
  await page.click("button:has-text(\"Submit\")");
  
  await expect(page).toHaveTitle(/Sailing Dashboard/);
}

async function createPlacemark(page: Page, title: string) {
  await page.fill("input[name=\"title\"]", title);
  await page.click("button:has-text(\"Add Placemark\")");
  
  await expect(page.locator(".box .title").filter({ hasText: title })).toBeVisible();
}

test.describe("Placemark Functional Tests", () => {
  
  test("should allow a user to signup and login", async ({ page }) => {
    const user = generateUser();
    await signupAndLogin(page, user);
    
    await expect(page.locator("body")).toContainText("Welcome to your Dashboard");
  });

  test("should allow a user to add a placemark", async ({ page }) => {
    const user = generateUser();
    await signupAndLogin(page, user);
    
    const placemarkTitle = `Marina ${Date.now()}`;
    await createPlacemark(page, placemarkTitle);
  });

  test("should allow a user to edit a placemark", async ({ page }) => {
    const user = generateUser();
    await signupAndLogin(page, user);
    
    const placemarkTitle = `Edit Me ${Date.now()}`;
    await createPlacemark(page, placemarkTitle);

    // Go to details
    const placemarkBox = page.locator(".box", { hasText: placemarkTitle });
    await placemarkBox.locator("a[href*=\"/dashboard/placemark/\"]").click();

    await expect(page.locator("body")).toContainText(`Placemark: ${placemarkTitle}`);
    
    // Edit
    await page.click("a[href*=\"/dashboard/edit/\"]");
    await page.fill("input[name=\"latitude\"]", "53.00");
    await page.fill("input[name=\"longitude\"]", "40.00");
    await page.fill("textarea[name=\"description\"]", "Updated Description");
    await page.check("input[name=\"private\"][value=\"false\"]");
    await page.click("button:has-text(\"Add Details\")");

    await expect(page.url()).toContain("/dashboard/placemark/");
    await expect(page.locator("body")).toContainText("Updated Description");
  });

  test("should allow a user to delete a placemark", async ({ page }) => {
    const user = generateUser();
    await signupAndLogin(page, user);
    
    const placemarkTitle = `Delete Me ${Date.now()}`;
    await createPlacemark(page, placemarkTitle);

    const placemarkBox = page.locator(".box", { hasText: placemarkTitle });
    await expect(placemarkBox).toBeVisible();
    
    
    await placemarkBox.locator("a[href*=\"/dashboard/deleteplacemark/\"]").click();
    
    await expect(page.locator(".box .title").filter({ hasText: placemarkTitle })).not.toBeVisible();
  });

  test("should allow a user to add a comment and rating", async ({ page }) => {
    const user = generateUser();
    await signupAndLogin(page, user);
    
    const placemarkTitle = `Comment Me ${Date.now()}`;
    await createPlacemark(page, placemarkTitle);

    // Go to details
    const placemarkBox = page.locator(".box", { hasText: placemarkTitle });
    await placemarkBox.locator("a[href*=\"/dashboard/placemark/\"]").click();

    // Add comment
    const commentText = "This is a fantastic spot!";
    await page.selectOption("select[name=\"rating\"]", "5");
    await page.fill("textarea[name=\"text\"]", commentText);
    await page.click("button:has-text(\"Submit Review\")");

    // Check if comment appears
    await expect(page.locator("body")).toContainText(commentText);
    await expect(page.locator("body")).toContainText("⭐⭐⭐⭐⭐");
    await expect(page.locator("body")).toContainText(user.username);
  });
});
