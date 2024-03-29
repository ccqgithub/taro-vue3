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
  WebView,
  WebViewProps,
  Textarea,
  TextareaProps,
  Swiper,
  SwitchProps,
  SwiperItem,
  SwiperItemProps,
  Picker,
  PickerView,
  PickerViewProps,
  PickerViewColumn,
  PickerViewColumnProps,
  PickerMultiSelectorProps,
  PickerTimeProps,
  PickerDateProps,
  PickerRegionProps,
  PickerSelectorProps,
  RootPortal,
  BaseEventOrig,
  StandardProps,
  SwiperProps,
  CustomWrapper,
  CustomWrapperProps,
  PageContainer,
  PageContainerProps,
  Navigator,
  NavigatorProps,
  ITouchEvent,
  ITouch
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
  SwitchProps,
  SwiperItemProps,
  BaseEventOrig,
  PickerViewProps,
  PickerViewColumnProps,
  PickerMultiSelectorProps,
  PickerTimeProps,
  PickerDateProps,
  PickerRegionProps,
  PickerSelectorProps,
  CustomWrapperProps,
  ITouchEvent,
  ITouch
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
  | 'class'
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
  tag: any
) => {
  return ((props, ctx) => {
    return h(tag, { ...props, ...ctx.attrs }, ctx.slots);
  }) as FunctionalComponent<T, LowercaseKeys<PropsToEmits<P>>>;
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
export const NSwiper = createComponent<SwiperProps>(Swiper);
export const NSwiperItem = createComponent<SwiperItemProps>(SwiperItem);
export const NPicker = createComponent<
  | PickerMultiSelectorProps
  | PickerTimeProps
  | PickerDateProps
  | PickerRegionProps
  | PickerSelectorProps
>(Picker);
export const NPickerView = createComponent<PickerViewProps>(PickerView);
export const NPickerViewColumn =
  createComponent<PickerViewColumnProps>(PickerViewColumn);
export const NRootPortal = createComponent<{}>(RootPortal);
export const NCustomWrapper =
  createComponent<CustomWrapperProps>(CustomWrapper);
export const NPageContainer =
  createComponent<PageContainerProps>(PageContainer);
export const NNavigator = createComponent<NavigatorProps>(Navigator);
