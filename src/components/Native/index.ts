import { FunctionalComponent, CSSProperties, h } from 'vue';
import {
  ViewProps,
  ScrollViewProps,
  ImageProps,
  TextProps,
  ButtonProps,
  InputProps,
  WebViewProps,
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

type LowercaseKeys<O extends Record<string, any>> = {
  [K in keyof O as Lowercase<string & K>]: O[string & K];
};

// get event keys from props
// { onClick: FN } => ['click']
type EventKeys<T> = NonNullable<
  {
    [K in keyof T]: K extends `on${infer E}` ? Uncapitalize<E> : never;
  }[keyof T]
>;

// filter event properties
// { onClick: FN, other: any } => { click: FN }
type Events<T extends Record<string, any>> = {
  [Key in EventKeys<T>]: Required<T>[`on${Capitalize<Key>}`];
};

// props => emits
// { onClick: FN } => { click: FN, tap: FN }
type PropsToEmits<P extends Record<string, any>> = Required<Events<P>>;

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
  tag: string
) => {
  return ((props, ctx) => {
    return h(tag, { ...props, ...ctx.attrs }, ctx.slots);
  }) as FunctionalComponent<T, LowercaseKeys<PropsToEmits<P>>>;
};

export * from './NPageMeta';
export const NView = createComponent<ViewProps>('view');
export const NImage = createComponent<ImageProps>('image');
export const NText = createComponent<TextProps>('text');
export const NScrollView = createComponent<ScrollViewProps>('scroll-view');
export const NButton = createComponent<ButtonProps>('button');
export const NInput = createComponent<InputProps>('input');
export const NTextArea = createComponent<TextareaProps>('textarea');
export const NWebView = createComponent<WebViewProps>('web-view');
