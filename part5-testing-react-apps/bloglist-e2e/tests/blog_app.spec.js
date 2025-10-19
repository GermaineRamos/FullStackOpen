const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");

    const user = {
      name: "Test User",
      username: "testuser2",
      password: "password123",
    };

    await request.post("http://localhost:3003/api/users", {
      data: user,
      headers: { "Content-Type": "application/json" },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.locator('input[name="Username"]').fill("testuser2");
      await page.locator('input[name="Password"]').fill("password123");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Test User logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.locator('input[name="Username"]').fill("testuser");
      await page.locator('input[name="Password"]').fill("wrong");
      await page.getByRole("button", { name: "login" }).click();
      const errorMessage = await page.getByText("Wrong username or password");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toHaveCSS("color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill("testuser2");
      await page.locator('input[name="Password"]').fill("password123");
      await page.getByRole("button", { name: "login" }).click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.waitForSelector('button:has-text("create new blog")', {
        timeout: 15000,
      });
      await page.click('button:has-text("create new blog")');
      await page.getByPlaceholder("write title here").fill("Test Blog");
      await page.getByPlaceholder("write author here").fill("Test Author");
      await page.getByPlaceholder("write url here").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();
      await expect(page.getByText("Test Blog Test Author")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await page.waitForSelector('button:has-text("create new blog")', {
        timeout: 15000,
      });
      await page.click('button:has-text("create new blog")');
      await page.getByPlaceholder("write title here").fill("Test Blog");
      await page.getByPlaceholder("write author here").fill("Test Author");
      await page.getByPlaceholder("write url here").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("creator can delete blog", async ({ page }) => {
      await page.waitForSelector('button:has-text("create new blog")', {
        timeout: 15000,
      });
      await page.click('button:has-text("create new blog")');
      await page.getByPlaceholder("write title here").fill("Test Blog");
      await page.getByPlaceholder("write author here").fill("Test Author");
      await page.getByPlaceholder("write url here").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();
      await page.getByRole("button", { name: "view" }).click();
      await page.once("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();
      await expect(page.locator(".blog-basic-info")).not.toBeVisible();
    });

    test("only creator sees delete button", async ({ page, request }) => {
      await page.waitForSelector('button:has-text("create new blog")', {
        timeout: 15000,
      });
      await page.click('button:has-text("create new blog")');
      await page.getByPlaceholder("write title here").fill("Test Blog");
      await page.getByPlaceholder("write author here").fill("Test Author");
      await page.getByPlaceholder("write url here").fill("http://test.com");
      await page.getByRole("button", { name: "create" }).click();
      await page.getByRole("button", { name: "logout" }).click();

      const anotherUser = {
        name: "Another User",
        username: "anotheruser",
        password: "anotherpass",
      };
      await request.post("http://localhost:3003/api/users", {
        data: anotherUser,
        headers: { "Content-Type": "application/json" },
      });

      await page.locator('input[name="Username"]').fill("anotheruser");
      await page.locator('input[name="Password"]').fill("anotherpass");
      await page.getByRole("button", { name: "login" }).click();
      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });

    test(
      "blogs are ordered by likes",
      async ({ page }) => {
        async function ensureToggleIsCollapsed() {
          if (await page.isVisible('button:has-text("cancel")')) {
            await page.click('button:has-text("cancel")');
            await page.waitForSelector('button:has-text("create new blog")', {
              timeout: 15000,
            });
          }
        }

        async function createBlog(title, author, url) {
          await ensureToggleIsCollapsed();
          await page.click('button:has-text("create new blog")');
          await page.getByPlaceholder("write title here").fill(title);
          await page.getByPlaceholder("write author here").fill(author);
          await page.getByPlaceholder("write url here").fill(url);
          await page.getByRole("button", { name: "create" }).click();
          await expect(
            page.getByText(`A new blog ${title} by ${author} added`)
          ).toBeVisible();
        }

        async function likeBlog(title, likeCount) {
          const blogContainer = page.locator(".blog", { hasText: title });
          const viewButton = blogContainer.getByRole("button", {
            name: "view",
          });
          if (await viewButton.isVisible()) {
            await viewButton.click();
          }
          for (let i = 0; i < likeCount; i++) {
            await blogContainer.getByRole("button", { name: "like" }).click();
            await page.waitForTimeout(200);
          }
        }

        await createBlog("First Blog", "Author 1", "http://test1.com");
        await page.waitForTimeout(500);
        await createBlog("Second Blog", "Author 2", "http://test2.com");
        await page.waitForTimeout(500);
        await createBlog("Third Blog", "Author 3", "http://test3.com");
        await page.waitForTimeout(500);

        const blogContainers = page.locator(".blog");
        const blogCount = await blogContainers.count();
        for (let i = 0; i < blogCount; i++) {
          const blog = blogContainers.nth(i);
          const viewButton = blog.getByRole("button", { name: "view" });
          if (await viewButton.isVisible()) {
            await viewButton.click();
            await page.waitForTimeout(100);
          }
        }

        await likeBlog("First Blog", 5);
        await likeBlog("Second Blog", 10);
        await likeBlog("Third Blog", 15);

        const updatedBlogElements = await page.locator(".blog").all();
        const likes = await Promise.all(
          updatedBlogElements.map(async (element) => {
            const text = await element.textContent();
            const match = text.match(/likes (\d+)/);
            return match ? parseInt(match[1]) : 0;
          })
        );

        for (let i = 0; i < likes.length - 1; i++) {
          expect(likes[i]).toBeGreaterThanOrEqual(likes[i + 1]);
        }
      },
      { timeout: 60000 }
    );
  });
});
