import {
  getSystemInfoSync,
  getStorageSync,
  setStorageSync
} from '@tarojs/taro';
import { createI18n } from 'vue-i18n';

const languageKey = 'language';

// 语言类型
export enum LangType {
  ZH = 'zh-Hans',
  EN = 'en-US'
}

// 支持的语言
export const languages = [LangType.ZH, LangType.EN];

// 语言映射
export const languagesMap: [RegExp, LangType][] = [
  [/^zh-hans-*/i, LangType.ZH],
  [/^zh-*/i, LangType.ZH]
];

// 选择语言
export const LangSelects: { value: LangType; text: string }[] = [
  {
    value: LangType.ZH,
    text: '中文'
  },
  {
    value: LangType.EN,
    text: 'English'
  }
];

// 默认语言
export const defaultLanguage: LangType = LangType.EN;

export const normalizeLang = (lang: string): string => {
  if (!lang) return '';
  const l = lang.toLowerCase();
  const find = languages.find((v) => v.toLowerCase() === l);
  if (find) return find;
  const findMap = languagesMap.find((v) => v[0].test(l));
  return findMap ? findMap[1] : '';
};

export const getLangFromSystem = () => {
  const sysInfo = getSystemInfoSync();
  return normalizeLang(sysInfo.language || '');
};

export const getLangFromStore = () => {
  return normalizeLang(getStorageSync(languageKey) || '');
};

export const getInitLanguage = (): LangType => {
  let lang = '';

  lang = getLangFromStore();
  if (lang) return lang as LangType;

  lang = getLangFromSystem();
  if (lang) return lang as LangType;

  return defaultLanguage;
};

export const i18nMessages = {
  [LangType.ZH]: {},
  [LangType.EN]: {}
};

const lang = getInitLanguage();

setStorageSync(languageKey, lang[0]);

export const i18n = createI18n({
  legacy: false,
  locale: lang[0],
  fallbackLocale: lang[0],
  messages: i18nMessages
});

export const setLanguage = (lang: LangType) => {
  i18n.global.locale.value = lang;
  setStorageSync(languageKey, lang);
};
