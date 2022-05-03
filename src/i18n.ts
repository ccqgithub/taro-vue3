import { createI18n } from 'vue-i18n';
import { i18nMessages, getDefaultLanguage } from '@/constants';

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLanguage(),
  fallbackLocale: getDefaultLanguage(),
  messages: i18nMessages
});
