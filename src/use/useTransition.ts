import { Ref, ref, onMounted, onUnmounted, watch, WatchStopHandle } from 'vue';
import Taro from '@tarojs/taro';
// import { safeNextTick } from '@/utils';

export const useTransition = (args: {
  // 用来探测的 selector
  selector: string;
  // 是否 visible
  visible: Ref<boolean>;
  // 进入动画 class
  enterClass: string;
  // 离开动画 class
  leaveClass: string;
  // 开始显示
  onShow?: () => void;
  // 完全隐藏
  onHide?: () => void;
  // 初始化
  onInit?: () => void;
  // 初始化状态改变
  onInitedChange?: (v: boolean) => void;
}) => {
  const visible = ref(args.visible.value);
  const inited = ref(false);
  const classes = ref('');
  const transitionEnd = ref(true);

  const onTranstionEnd = () => {
    if (transitionEnd.value) return;
    transitionEnd.value = true;

    if (args.visible.value) {
      inited.value = true;
      args.onInit?.();
      args.onInitedChange?.(inited.value);
    } else {
      visible.value = false;
      args.onHide?.();
    }
  };

  let stopWatch: WatchStopHandle | null = null;
  onMounted(() => {
    stopWatch = watch(
      () => {
        return args.visible.value;
      },
      (v, lastV) => {
        if (v) {
          // show
          visible.value = true;
          classes.value = ``;
          transitionEnd.value = false;
          args.onShow?.();

          // next tick to trigger transition
          Taro.nextTick(() => {
            classes.value = `${args.enterClass}`;
            onTranstionEnd();
          });
          // safeNextTick({
          //   selector: args.selector,
          //   cb: () => {
          //     classes.value = `${args.enterClass}`;
          //   }
          // });
        } else {
          if (lastV === undefined) {
            // 初始化就是 visible false
          } else {
            // hide
            inited.value = false;
            classes.value = `${args.leaveClass}`;
            transitionEnd.value = false;
            args.onInitedChange?.(inited.value);
          }
        }
      },
      {
        immediate: true
      }
    );
  });

  onUnmounted(() => {
    stopWatch?.();
  });

  return {
    visible,
    inited,
    classes,
    onTranstionEnd
  };
};
