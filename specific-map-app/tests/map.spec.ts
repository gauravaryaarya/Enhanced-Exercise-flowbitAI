import { test, expect } from '@playwright/test';

test.describe('Map Application', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should load the map container and sidebar', async ({ page }) => {
    // Check Sidebar title
    await expect(page.getByText('SatView Explorer')).toBeVisible();
    
    // Check Leaflet container
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();
  });

  test('should toggle WMS layer visibility', async ({ page }) => {
    // Initially the toggle should be active (blue)
    const toggleBtn = page.locator('button.bg-blue-600');
    await expect(toggleBtn).toBeVisible();

    // Click to toggle off
    await toggleBtn.click();
    
    // Should change color class to grey/slate indicating off
    const toggledOffBtn = page.locator('button.bg-slate-300');
    await expect(toggledOffBtn).toBeVisible();
  });

  test('should display drawing tools', async ({ page }) => {
    const drawToolbar = page.locator('.leaflet-draw-toolbar-top');
    await expect(drawToolbar).toBeVisible();
  });
});