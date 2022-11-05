import { watchEffect } from 'vue';
import { usePage } from '@/use/usePage';

export const useShow = (
  fn: () => void,
  args: {
    ignoreSamePage?: boolean;
    minDuration?: number;
  } = {}
) => {
  const { ignoreSamePage = false, minDuration } = args;
  const { isShow, lastShowPage, lastShowTime, showPage, showTime } = usePage();

  watchEffect(() => {
    if (!isShow.value) return;
    Promise.resolve().then(() => {
      // 重复 onShow onHide bug
      if (
        lastShowPage.value === showPage.value &&
        showTime.value - lastShowTime.value <= 300
      ) {
        return;
      }

      if (ignoreSamePage && lastShowPage.value === showPage.value) return;

      if (minDuration) {
        if (
          lastShowPage.value === showPage.value &&
          lastShowTime.value - showTime.value < minDuration
        ) {
          return;
        }
      }

      fn();
    });
  });
};
