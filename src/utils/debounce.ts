export default function debounce<F extends (...args: any[]) => void>(
  fn: F,
  delay: number,
  opts?: {
    leading?: boolean;
  }
): F {
  const { leading = true } = opts || {};
  return function (this: any, ...args: any[]) {
    const that = this as ThisType<any>;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let last_exec: number | null = null;
    const exec = () => {
      last_exec = Date.now();
      fn.apply(that, args);
    };
    timer && clearTimeout(timer);
    if (leading && !last_exec) {
      exec();
      return;
    }
    timer = setTimeout(exec, delay);
  } as F;
}
