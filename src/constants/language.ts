enum LangType {
  ZH = 'zh-Hans'
}

// 支持的语言
const languages = [LangType.ZH];

// 语言映射
const languagesMap: [RegExp, LangType][] = [
  [/^zh-hans-*/i, LangType.ZH],
  [/^zh-*/i, LangType.ZH]
];

// 默认语言
const defaultLanguage: LangType = LangType.ZH;

const getDefaultLanguage = () => {
  return defaultLanguage;
};

// 选择语言
const LangSelects: { value: LangType; text: string }[] = [
  {
    value: LangType.ZH,
    text: '中文'
  }
];

export {
  LangType,
  languages,
  languagesMap,
  defaultLanguage,
  getDefaultLanguage,
  LangSelects
};
