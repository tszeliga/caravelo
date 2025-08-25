import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'backOffice',
    themes: {
      backOffice: {
        dark: false,
        colors: {
          primary: '#1976d2'
        }
      }
    }
  },
  defaults: {
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      // Prevent animation issues by ensuring proper measurements
      transition: 'fade-transition'
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
