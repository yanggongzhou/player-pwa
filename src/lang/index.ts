import { createI18n } from 'vue-i18n' // import from runtime only

import zhHkLocale from './zh-hk'
import zhCnLocale from './zh-cn'
import { App } from 'vue'
import { createRouterGuards } from '@/router/router-guards'
import router from '@/router'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh-hk',
  messages: {
    'zh-hk': {
      ...zhHkLocale
    },
    'zh-cn': {
      ...zhCnLocale
    }
  }
})

export function setupI18n (app: App): void {
  app.use(i18n);
}

export default i18n
