import { test, expect } from '@playwright/test';

test.describe('Satellite Intelligence Interface', () => {
  
  test.beforeEach(async ({ page }) => {
    // Make sure your dev server is running on 5173
    await page.goto('http://localhost:5173');
  });

  test('should load the map and initial sidebar state', async ({ page }) => {
    // 1. Verify Map Container exists
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();

    // 2. Verify Sidebar Header matches Figma
    await expect(page.getByText('Define Area of Interest')).toBeVisible();

    // 3. FIX: Match the NEW placeholder text from your latest Sidebar code
    await expect(page.getByPlaceholder('Type a city name (e.g. London)')).toBeVisible();
  });

  test('should render custom drawing tools', async ({ page }) => {
    // Check for the "White Pill" toolbar container
    // We use the specific z-index class we added to identify it
    const toolbar = page.locator('.z-\\[2000\\]'); 
    await expect(toolbar).toBeVisible();

    // Check specifically for the Polygon tool using the title attribute
    const polygonBtn = page.locator('button[title="Draw Shape"]');
    await expect(polygonBtn).toBeVisible();
    await expect(polygonBtn).toBeEnabled();
  });

  test('should allow user to type in search', async ({ page }) => {
    // FIX: Match the NEW placeholder text here too
    const searchInput = page.getByPlaceholder('Type a city name (e.g. London)');
    
    // Simulate user typing
    await searchInput.fill('Berlin');
    
    // Verify value is held in state
    await expect(searchInput).toHaveValue('Berlin');
    
    // Verify the "Apply" button is visible
    const applyBtn = page.getByRole('button', { name: 'Apply outline as base image' });
    await expect(applyBtn).toBeVisible();
  });

});