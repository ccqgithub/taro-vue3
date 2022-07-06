import { VNode, FunctionalComponent } from 'vue';

export const RenderSlots = ((props) => {
  return props.nodes;
}) as FunctionalComponent<{ nodes: VNode[] }, {}>;
