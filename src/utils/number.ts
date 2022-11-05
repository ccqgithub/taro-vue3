export function toFixed(num: number, precision: number) {
  // 修复js toFixed精度bug
  return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(
    precision
  );
}

// 格式化数字
export function formatNumber(
  num: number,
  args: {
    // 倍数
    multiple?: number;
    // 小数位数
    decimal?: number;
    // 小数分隔符
    decimalSep?: string;
    // 是否千分位
    thousands?: boolean;
    // 千分位分隔符
    thousandsSep?: string;
    // 符号
    sign?: string;
    // 符号和数字之间是否需要空白符
    signSpace?: boolean;
  } = {}
) {
  const {
    multiple = 1,
    decimal = 2,
    decimalSep = '.',
    thousands = true,
    thousandsSep = ',',
    sign = '',
    signSpace = false
  } = args;
  // multiple
  let value: string | number = num * multiple;
  // 小数位数
  value = toFixed(value, decimal);
  // decimal
  value = `${value}`.replace(/\./, decimalSep);
  // thousands
  if (thousands) {
    const arr = `${value}`.split(decimalSep);
    arr[0] = arr[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    value = arr.join(decimalSep);
  }
  // sign
  if (sign) {
    const arr = value.split('-');
    arr[arr.length - 1] = `${sign}${signSpace ? ' ' : ''}${
      arr[arr.length - 1]
    }`;
    value = arr.join('-');
  }

  return value;
}

// 过滤数字最多保留两位小数
export const filterNumber = (str: string) => {
  const v = str.replace(/[^\d.]+/g, '').replace(/^(\d*\.\d{0,2}).*$/, '$1');
  return v;
};
