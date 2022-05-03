import { FunctionalComponent, CSSProperties, h } from 'vue';
import {
  View,
  ViewProps,
  ScrollView,
  ScrollViewProps,
  Image,
  ImageProps,
  Text,
  TextProps,
  Button,
  ButtonProps,
  Input,
  InputProps,
  Textarea,
  WebViewProps,
  WebView,
  TextareaProps,
  BaseEventOrig,
  StandardProps
} from '@tarojs/components';

export type {
  ViewProps,
  ScrollViewProps,
  ImageProps,
  TextProps,
  StandardProps,
  ButtonProps,
  InputProps,
  TextareaProps,
  WebViewProps,
  BaseEventOrig
};

// get event keys from props
// { onClick: FN } => ['click']
type EventKeys<T> = {
  [K in keyof T]: K extends `on${infer E}` ? Uncapitalize<E> : never;
}[keyof T];
// filter event properties
// { onClick: FN, other: any } => { click: FN }
type Events<T extends Record<string, any>> = {
  [Key in EventKeys<T>]: Required<T>[`on${Capitalize<Key>}`];
};
// click to tap
type EmitsTransform<T extends Record<string, any>> = T & {
  tap: T['click'];
};
// props => emits
// { onClick: FN } => { click: FN, tap: FN }
type PropsToEmits<P extends Record<string, any>> = EmitsTransform<
  Required<Events<P>>
>;

// https://github.com/NervJS/taro/blob/next/packages/taro-components/types/index.vue3.d.ts
// 联合类型不能用omit（比如picker）
type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;
type SlimProps = {
  class?: any;
  style?: CSSProperties;
  innerHTML?: string;
  // setRef?: (el: Element | null) => void;
};
/** 转换react的类型到vue */
type RemoveReactAttribute =
  | 'className'
  | 'style'
  | 'key'
  | 'ref'
  | 'dangerouslySetInnerHTML';
export type TransformReact2VueType<
  P extends Record<string, any> = Record<string, any>
> = DistributiveOmit<P, RemoveReactAttribute> & {
  onTap?: P['onClick'];
} & SlimProps;

const createComponent = <
  P extends Record<string, any>,
  T = TransformReact2VueType<P>
>(
  component: any
) => {
  return ((props, ctx) => {
    return h(component, { ...props, ...ctx.attrs }, ctx.slots.default?.());
  }) as FunctionalComponent<T, PropsToEmits<P>>;
};

export * from './NPageMeta';
export const NView = createComponent<ViewProps>(View);
export const NImage = createComponent<ImageProps>(Image);
export const NText = createComponent<TextProps>(Text);
export const NScrollView = createComponent<ScrollViewProps>(ScrollView);
export const NButton = createComponent<ButtonProps>(Button);
export const NInput = createComponent<InputProps>(Input);
export const NTextArea = createComponent<TextareaProps>(Textarea);
export const NWebView = createComponent<WebViewProps>(WebView);
