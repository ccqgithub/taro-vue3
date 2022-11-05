import { DefineComponent } from 'vue';
import {
  Translation as I18nTransition,
  TranslationProps as I18nTProps
} from 'vue-i18n';

const I18nT = I18nTransition as any as DefineComponent<I18nTProps>;

export type { I18nTProps };

export { I18nT };
