import { test, expect } from "@playwright/test";

test('todo list default visual', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?globals=&args=&id=components-todolist--default');
    await page.waitForSelector('.todo-app');

    await expect(page).toHaveScreenshot('todo-list-default.png');
});

test('todo list empty state visual', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?globals=&args=&id=components-todolist--empty-state');
    await page.waitForSelector('.todo-app');

    await expect(page).toHaveScreenshot('todo-list-empty-state.png');
});