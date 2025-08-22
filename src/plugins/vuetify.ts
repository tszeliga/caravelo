import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: {
    defaultTheme: 'backOffice',
    themes: {
      backOffice: {
        dark: false,
        colors: {
          primary: '#1976d2',    // Professional blue
          secondary: '#424242',  // Corporate gray
          success: '#4caf50',    // Muted success green
          warning: '#ff9800',    // Professional orange
          error: '#d32f2f',      // Conservative red
          info: '#1976d2',       // Match primary for consistency
          surface: '#ffffff',    // Clean white surfaces
          background: '#fafafa', // Subtle gray background
        }
      },
      backOfficeDark: {
        dark: true,
        colors: {
          primary: '#42a5f5',
          secondary: '#6d6d6d',
          surface: '#1e1e1e',
          background: '#121212',
        }
      }
    }
  },
  defaults: {
    // Corporate styling overrides
    VCard: {
      elevation: 1,        // Subtle shadows for professional feel
      rounded: 'sm',       // Conservative border radius
    },
    VBtn: {
      style: [
        { fontWeight: '500' },  // Medium weight for authority
        { textTransform: 'none' } // No uppercase for readability
      ]
    },
    VDialog: {
      persistent: true,    // Prevent accidental closes in workflows
      scrollable: true,    // Handle content overflow gracefully
    },
    VTextField: {
      variant: 'outlined', // Clear form field boundaries
      density: 'comfortable', // Adequate touch targets
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      menuProps: { offsetY: true } // Better dropdown positioning
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})