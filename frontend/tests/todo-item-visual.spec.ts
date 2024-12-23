import { test, expect } from "@playwright/test";

test('todo item default visual', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?globals=&args=&id=components-todoitem--default');

    await page.waitForSelector('.todo-item');

    await expect(page).toHaveScreenshot('todo-item-default.png');
});

test('todo item completed visual', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?globals=&args=&id=components-todoitem--completed');
    await page.waitForSelector('.todo-item');

    await expect(page).toHaveScreenshot('todo-item-completed.png');
});

test('todo item edit visual', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?globals=&args=&id=components-todoitem--edit-todo');
    await page.waitForSelector('.todo-item');
    await expect(page).toHaveScreenshot('todo-item-edit.png');
});