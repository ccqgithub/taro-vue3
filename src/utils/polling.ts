// 轮询接口
type IPollingApi = {
  timer: ReturnType<typeof setTimeout> | null;
  end: boolean;
};
const pollingApis: Record<string, IPollingApi> = {};

type IPollingCallParams<T> = {
  name: string;
  fetch: () => Promise<T>;
  success: (v: T) => void;
  interval?: number;
};
// 开始轮询接口
export const startPollingCall = <T>(params: IPollingCallParams<T>) => {
  const { interval = 3000 } = params;

  // 相同name忽略
  if (pollingApis[params.name]) {
    return;
  }

  pollingApis[params.name] = {
    end: false,
    timer: null
  };

  const item = pollingApis[params.name];

  const loop = () => {
    if (item.end) return;
    params
      .fetch()
      .then((v) => {
        if (item.end) return;
        let res: any = null;
        if (params.success) {
          res = params.success(v);
        }
        return Promise.resolve(res).then(() => {
          item.timer = setTimeout(() => loop(), interval);
        });
      })
      .catch(() => {
        if (item.end) return;
        item.timer = setTimeout(() => loop(), interval);
      });
  };
  // start loop
  loop();

  // cancel
  return () => {
    endPollingCall(params.name);
  };
};

export const endPollingCall = (name: string) => {
  if (pollingApis[name]) {
    pollingApis[name].end = true;
    if (pollingApis[name].timer) {
      clearTimeout(pollingApis[name].timer!);
    }
  }
  delete pollingApis[name];
};
