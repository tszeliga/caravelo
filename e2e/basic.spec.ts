import { expect, test } from '@playwright/test'

test.describe('Basic Application E2E', () => {
  test('should load the application and show back office view', async ({
    page
  }) => {
    // Navigate to the application
    await page.goto('/')

    // Wait for the page to load and verify basic elements
    await page.waitForSelector('[data-testid="back-office-view"]', {
      timeout: 10000
    })

    // Verify we can see the main elements
    await expect(page.locator('[data-testid="back-office-view"]')).toBeVisible()
    await expect(
      page.locator('h3:has-text("Active Subscribers:")')
    ).toBeVisible()
  })
})
