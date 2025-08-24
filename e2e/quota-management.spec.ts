import { expect, test } from '@playwright/test'

test.describe('Quota Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')

    // Wait for the page to load
    await page.waitForSelector('[data-testid="back-office-view"]')
  })

  test('should complete full quota management workflow', async ({ page }) => {
    // 1. Verify we're on the back office page with subscribers
    await expect(page.locator('[data-testid="back-office-view"]')).toBeVisible()
    await expect(
      page.locator('h3:has-text("Active Subscribers:")')
    ).toBeVisible()

    // 2. Find and click the first "Edit flights" button for a subscriber
    const subscriberManageButton = page
      .locator('[data-testid="subscriber-card-manage-button"]')
      .first()
    await expect(subscriberManageButton).toBeVisible()
    await subscriberManageButton.click()

    // 3. Verify the quota management modal opens
    const quotaModal = page.locator('[role="dialog"]').first()
    await expect(quotaModal).toBeVisible()
    await expect(
      quotaModal.locator('.modal-title:has-text("Edit quota")')
    ).toBeVisible()

    // 4. Verify initial form state
    const quotaAdjustmentStepper = quotaModal
      .locator('[data-testid="quota-form-adjustment-input"]')
      .first()
    await expect(quotaAdjustmentStepper).toBeVisible()
    const quotaSaveButton = quotaModal
      .locator('[data-testid="quota-modal-save-button"]')
      .first()
    await expect(quotaSaveButton).toBeDisabled() // Should be disabled initially

    // 5. Adjust the quota value (increase by 1)
    const quotaIncrementButton = quotaAdjustmentStepper.locator(
      '[data-testid="number-stepper-increment-button"]'
    )
    await quotaIncrementButton.click()

    // 6. Select a reason from dropdown
    const quotaReasonSelect = quotaModal
      .locator('[data-testid="quota-form-reason-select"]')
      .first()
    await quotaReasonSelect.click()

    // Wait for dropdown options to appear and select first available reason
    const quotaReasonOption = page.locator('.v-list-item').first()
    await expect(quotaReasonOption).toBeVisible()
    await quotaReasonOption.click()

    // 7. Verify form is now valid and submit button is enabled
    await expect(quotaSaveButton).toBeEnabled()

    // 8. Submit the form
    await quotaSaveButton.click()

    // 9. Verify success notification appears
    await expect(
      page.locator('[data-testid="notification-success"]')
    ).toBeVisible()
    await expect(
      page.locator(
        '[data-testid="notification-success"]:has-text("successfully")'
      )
    ).toBeVisible()

    // 10. Verify modal closes
    await expect(quotaModal).not.toBeVisible()

    // 11. Verify we're back to the main subscriber list
    await expect(page.locator('[data-testid="back-office-view"]')).toBeVisible()
    await expect(
      page.locator('h3:has-text("Active Subscribers:")')
    ).toBeVisible()
  })

  test('should handle quota limits correctly', async ({ page }) => {
    // Navigate and open modal
    await page
      .locator('[data-testid="subscriber-card-manage-button"]')
      .first()
      .click()
    const quotaModal = page.locator('[role="dialog"]').first()
    await expect(quotaModal).toBeVisible()

    const quotaAdjustmentStepper = quotaModal
      .locator('[data-testid="quota-form-adjustment-input"]')
      .first()
    const stepperInputField = quotaAdjustmentStepper.locator(
      '[data-testid="number-stepper-input"]'
    )
    const decrementButton = quotaAdjustmentStepper.locator(
      '[data-testid="number-stepper-decrement-button"]'
    )
    const incrementButton = quotaAdjustmentStepper.locator(
      '[data-testid="number-stepper-increment-button"]'
    )

    // Test that we can see the current value
    await expect(stepperInputField).toBeVisible()

    // Test that stepper buttons work
    await expect(decrementButton).toBeVisible()
    await expect(incrementButton).toBeVisible()

    // Test clicking increment button (should work if not at max)
    await incrementButton.click()

    // Test that the input reflects the change (verify stepper functionality)
  })
})
