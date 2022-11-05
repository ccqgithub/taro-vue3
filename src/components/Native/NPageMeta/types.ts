import { PropType } from 'vue';
import { PageMetaProps as TaroPageMetaProps } from '@tarojs/components';
import { TypeFromProps } from '@/types';

export interface PageMetaPropsOrg
  extends Pick<
    TaroPageMetaProps,
    | 'backgroundTextStyle'
    | 'backgroundColor'
    | 'backgroundColorTop'
    | 'backgroundColorBottom'
    | 'scrollTop'
    | 'scrollDuration'
    | 'pageStyle'
    | 'rootFontSize'
  > {
  rootBackgroundColor?: string;
  pageFontSize?: string;
  pageOrientation?: 'auto' | 'portrait' | 'landscape';
}

export const IPageMetaProps = {
  meta: {
    type: Object as PropType<PageMetaPropsOrg>,
    default: () => {}
  }
};

export type PageMetaProps = TypeFromProps<typeof IPageMetaProps>;
