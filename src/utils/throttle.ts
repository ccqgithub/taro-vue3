export function throttle<F extends (...args: any[]) => any>(
  fn: F,
  interval: number,
  opts?: {
    trailing?: boolean;
  }
): F {
  const { trailing = true } = opts || {};
  let timer: ReturnType<typeof setTimeout>;
  let last_exec: number | null = null;
  return function (this: any, ...args: any[]) {
    const that = this as ThisType<any>;
    const exec = () => {
      last_exec = Date.now();
      fn.apply(that, args);
    };
    timer && clearTimeout(timer);
    const diff = interval - (Date.now() - (last_exec || -Infinity));
    if (diff <= 0) {
      exec();
    } else if (trailing) {
      timer = setTimeout(exec, diff);
    }
  } as F;
}
