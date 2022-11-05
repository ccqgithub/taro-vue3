import {
  getSystemInfoSync,
  getStorageSync,
  setStorageSync
} from '@tarojs/taro';
import { createI18n } from 'vue-i18n';
import zhJson from './locales/zh-Hans.json';
import enJson from './locales/en-US.json';

const languageKey = 'language';

// 语言类型
export enum LangType {
  ZH = 'zh-Hans',
  EN = 'en-US'
}

export const WechatLang: Record<string, string> = {
  [LangType.EN]: 'en',
  [LangType.ZH]: 'zh_CN'
};

// 支持的语言
export const languages = [LangType.ZH, LangType.EN];

// 语言映射
export const languagesMap: [RegExp, LangType][] = [
  [/^zh-hans-*/i, LangType.ZH],
  [/^zh-*/i, LangType.ZH],
  [/^en-*/i, LangType.EN]
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
export const defaultLanguage: LangType = LangType.ZH;

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
  // let lang = '';

  // lang = getLangFromStore();
  // if (lang) return lang as LangType;

  // lang = getLangFromSystem();
  // if (lang) return lang as LangType;

  return defaultLanguage;
};

export const i18nMessages = {
  [LangType.ZH]: zhJson,
  [LangType.EN]: enJson
};

const lang = getInitLanguage();

setStorageSync(languageKey, lang);

export const i18n = createI18n({
  legacy: false,
  locale: lang,
  fallbackLocale: lang,
  messages: i18nMessages
});

export const setLanguage = (lang: LangType) => {
  i18n.global.locale.value = lang;
  setStorageSync(languageKey, lang);
};

export const getWechatLang = () => {
  return WechatLang[i18n.global.locale.value];
};
