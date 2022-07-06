import { defineComponent, onUnmounted } from 'vue';
import { usePage } from '@/use';
import { getPortalId } from './context';

export const Portal = defineComponent({
  setup(_, ctx) {
    const id = getPortalId();
    const { setPortal, removePortal } = usePage();

    onUnmounted(() => {
      removePortal(id);
    });

    return () => {
      const children = ctx.slots.default?.() || [];
      setPortal(id, children);
      return null;
    };
  }
});
