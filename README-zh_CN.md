# umi-plugin-unstated

> umi-plugin-unstated

基于unstated-next(https://github.com/jamiebuilds/unstated-next)的umi插件，自动读取文件注册container。
2.x对应umi 4.x，[1.x](https://github.com/skimklin/umi-plugin-unstated/blob/version1.x/README.md)对应umi 3.x版本，根据需求选用不同版本。

[English](README.md) | 简体中文

## 安装

使用 npm:

```bash
$ npm install umi-plugin-unstated
```

使用 yarn:

```bash
$ yarn add umi-plugin-unstated
```

使用 pnpm:

```bash
$ pnpm add umi-plugin-unstated
```
 
## 使用

1. 在 umi 生成的 config 文件添加以下配置

```javascript
// in umi config file
export default defineConfig({
  unstated: {
    /**
     * global: boolean | string[]
     * 1. 若值为true，会把uModels下所有合法文件的默认导出全部注册到全局（不推荐）
     * 2. 若值为sting[]，会把列表中存在的注册到全局，剩下的用户自行处理（性能较好）
     * 3. uModels所有合法文件都会注册为Container并添加到umi下，导出key为uModels（import { uModels } from 'umi'）
     */
    global: ['global'],
    /**
     * 读取src下目录名
     */
    folder: 'uModels',
    /**
     * 调试模式，更多的输出信息
     */
    debug: true,
  },
});
```

2. src 下新建`uModels`文件夹，并添加文件`global.tsx`

```javascript
import { useState } from 'react';

export default function useGlobal() {
  const [global] = useState('global');

  return {
    global,
  };
}
```

3. 在页面中使用。如果 model 已经全局注册，可直接使用

```javascript
import React from 'react';
import { uModels } from 'umi';

const App = () => {
  const { global } = uModels.global.useContainer();
  return <div>{global}</div>;
};
```

4. 在页面中使用。如果 model 未全局注册，使用如下

```javascript
// src/uModels/example.tsx
import { useState } from 'react'

export default function useExample() {
  const [exampleState] = useState('example')

  return {
    exampleState,
  }
}

// MyComponent.tsx
import React from 'react';
import { uModels } from 'umi';

const ChildComponent = () => {
  const { exampleState } = uModels.example.useContainer();
  return (
    <div>
      child: {exampleState}
    </div>
  )
}
const MyComponent = () => {
  const { exampleState } = uModels.example.useContainer();
  return (
    <div>
      {exampleState}
      <ChildComponent/>
    </div>
  )
}

export default () => uModels.example.wrapProvider(<MyComponent/>)
```
