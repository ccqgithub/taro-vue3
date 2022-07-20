# Taro Vue3 快速开始脚手架

## 特性

- [`Taro3`](https://taro-docs.jd.com/taro/docs)。
- [`Vue3`](https://vuejs.org/)。
- [`Typescript`](https://www.typescriptlang.org/)。
- [`Vue I18n`国际化](https://vue-i18n.intlify.dev/)。
- [`Luxon`时间选择](https://moment.github.io/luxon/)。
- [`Pinia`状态管理](https://pinia.vuejs.org/) + [`Pinia DI`](https://github.com/ccqgithub/pinia-di)。
- [`Css Modules`](https://github.com/css-modules/css-modules)。
- `代码风格 Lint`: [`Eslint`](https://eslint.org/) + [`StyleLint`](https://stylelint.io/) + [`Prettier`](https://prettier.io/)。
- `Git Lint`: [`Husky`](https://github.com/typicode/husky) + [`CommitLint`](https://github.com/conventional-changelog/commitlint) + [`LintStaged`](https://github.com/okonet/lint-staged)。
- `路径别名`: `@/assets`, `@/components` 等等。
- `登录`: 内置简单的登录流程。
- `Portal`：Taro本身不支持`Teleport`组件，自己实现一个类似功能的`Portal`组件。
- `Popup`: 弹窗组件。
- `Toast`: 自定义Toast。
- `Modal`: 模态狂组件。
- `其他组件`

## 开发

1. 安装依赖：

```
npm install
```

2. Css Modules Type 定义文件生成

```
npm run style:dts
```

自定监听`.module.scss`文件，生成`.module.scss.d.ts`定义文件，这样引用的时候有类型提示。

3. 开发

```
npm run dev:weapp
```

## 目录

- `config`: `Build` 配置
- `envs`: `Build` 环境变量
- `scripts`: 脚本文件
- `src`: 主要源码
  - `@/assets`: 静态资源
    - `icon`: 图标
    - `static`: 静态大文件，不打包进小程序（`packOptions.ignore`），而是上传服务器，通过链接访问
    - `staticIcons`: 这里面的图标再小也不Base64，因为地图不能用
  - `@/components`: 组件库
  - `@/config`：配置
  - `@/constants`: 常量
      - `@/constants/langs`: 翻译文件
  - `@/types`: 类型定义
  - `@/pages`: 页面
  - `@/root`: 直接copy到根目录
  - `@/service`: 业务逻辑，API调用
  - `@/store`: 全局`Store`
  - `@/style`: 全局样式
  - `@/use`: 公用 Compisiton APIs
  - `@/utils`: 公用辅助方法

## 环境变量

> 执行`npm run env`会自动降`envs`目录下定义的环境变量名自动添加到`env.d.ts`文件中，从而支持`process.env.xx`类型提示。

- `process.env.TARO_ENV_REAL`: 构建类型，微信小程序、h5 等。
- `process.env.TARO_APP_ENV`: 构建的环境，比如 staging，test 等。

合并顺序：优先级从上到下

`process.env`
`.env.${taroEnv}.local`
`.env.local`
`.env.${taroEnv}.${nodeDev}`
`.env.${taroEnv}`
`.env`

## CSS Modules

执行`npm run styles:dts`，会监听`.module.scss`文件，自动生成`.module.scss.d.ts`，以支持 Typescript。

## 路径提示

为了便于文件迁移，以及区分第三方模块，设置`src/**`的别名为`@/`，导入文件用`import xx from '@/xx'`。

为了在 import image 的时候有路径提示，推荐 vscode 安装`path-autocomplete`，并且在项目下的`.vscode/settings.json`里配置：

```json
{
  "path-autocomplete.pathMappings": {
    "@": "${folder}/src",
    "~@": "${folder}/src"
  }
}
```

## Typescript

- 安装[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)插件。
- [Vue Typescript 开发注意事项](https://vuejs.org/guide/typescript/overview.html#ide-support)。

## Toast

```vue
<script setup lang="ts">
import { showToast } from '@/utils';

showToast('test');
</script>
```

## Confirm Modal

```vue
<script setup lang="ts">
import { confirm } from '@/utils';

const confirmSomething = async () => {
  const isConfirm = await confirm({
    title: '',
    content: ''
  })
}
</script>
```