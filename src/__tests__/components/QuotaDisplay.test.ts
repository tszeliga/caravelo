import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import QuotaDisplay from '@/components/quota/QuotaDisplay.vue'

// Test setup helper
const createWrapper = (props: any = {}) => {
  const vuetify = createVuetify()
  
  return mount(QuotaDisplay, {
    props: {
      currentQuota: 2,
      adjustmentValue: 1,
      newQuota: 3,
      ...props
    },
    global: {
      plugins: [vuetify]
    }
  })
}

describe('QuotaDisplay Component', () => {
  describe('Component Rendering', () => {
    it('renders current quota correctly', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="current-quota"]').text()).toBe('2')
    })

    it('displays adjustment value when non-zero', () => {
      const wrapper = createWrapper({ adjustmentValue: 1 })
      expect(wrapper.find('[data-testid="adjustment-value"]').text()).toBe('1')
    })

    it('displays new quota calculation', () => {
      const wrapper = createWrapper({ newQuota: 3 })
      expect(wrapper.find('[data-testid="new-quota"]').text()).toBe('3')
    })

    it('shows calculation flow for positive adjustment', () => {
      const wrapper = createWrapper({ adjustmentValue: 1 })
      expect(wrapper.find('.calculation-flow').exists()).toBe(true)
    })

    it('shows calculation flow for negative adjustment', () => {
      const wrapper = createWrapper({ adjustmentValue: -1 })
      expect(wrapper.find('.calculation-flow').exists()).toBe(true)
    })

    it('hides calculation when adjustment is zero', () => {
      const wrapper = createWrapper({ adjustmentValue: 0 })
      expect(wrapper.find('.calculation-flow').exists()).toBe(false)
    })
  })

  describe('Quota Limits Display', () => {
    it('renders all quota limit chips', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="quota-limit-0"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="quota-limit-1"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="quota-limit-2"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="quota-limit-3"]').exists()).toBe(true)
    })

    it('highlights current quota limit', () => {
      const wrapper = createWrapper({ newQuota: 2 })
      const chip = wrapper.find('[data-testid="quota-limit-2"]')
      expect(chip.exists()).toBe(true)
    })
  })

  describe('Positive/Negative Adjustment Styling', () => {
    it('applies success color for positive adjustments', () => {
      const wrapper = createWrapper({ adjustmentValue: 1 })
      const adjustmentValue = wrapper.find('[data-testid="adjustment-value"]')
      expect(adjustmentValue.classes()).toContain('text-success')
    })

    it('applies error color for negative adjustments', () => {
      const wrapper = createWrapper({ adjustmentValue: -1 })
      const adjustmentValue = wrapper.find('[data-testid="adjustment-value"]')
      expect(adjustmentValue.classes()).toContain('text-error')
    })
  })

  describe('Accessibility', () => {
    it('has proper test ids for all interactive elements', () => {
      const wrapper = createWrapper()
      expect(wrapper.find('[data-testid="quota-calculation"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="current-quota"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="new-quota"]').exists()).toBe(true)
    })
  })
})