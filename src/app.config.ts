export const AppRoutes = {
  index: 'index',
  login: 'login',
  h5: 'h5',
  me: 'me'
};

export const routePaths = Object.keys(AppRoutes).map((name) =>
  getRelativeRoutePath(name)
);
export const appTabs = [AppRoutes.index, AppRoutes.me];
const tabTitle = {
  [AppRoutes.index]: '首页',
  [AppRoutes.me]: '我的'
};
const list = appTabs.map((name) => ({
  pagePath: getRelativeRoutePath(name),
  text: tabTitle[name]
}));

export function getRelativeRoutePath(name: string) {
  return `pages/${name}/index`;
}

export function getRoutePath(name: string) {
  return `/${getRelativeRoutePath(name)}`;
}

export function isTabPath(path: string) {
  const p = path.replace(/\?.+$/, '').replace(/^\/+/, '');
  return !!appTabs.find((key) => {
    return getRelativeRoutePath(key) === p;
  });
}

export default {
  pages: routePaths,
  window: {
    navigationStyle: 'default',
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro Vue3',
    navigationBarTextStyle: 'black',
    restartStrategy: 'homePage'
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  },
  tabBar: {
    list,
    custom: true
  },
  usingComponents: {}
};
