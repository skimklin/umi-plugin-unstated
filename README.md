# umi-plugin-unstated

> umi-plugin-unstated

Based on unstated-next(https://github.com/jamiebuilds/unstated-next). Simple state management,just react itself.

## Install

Using npm:

```bash
$ npm install umi-plugin-unstated^1.1.0
```

or using yarn:

```bash
$ yarn add umi-plugin-unstated^1.1.0
```

## Usage

1. 在 umi 生成的 config 文件添加以下配置

```javascript
// in umi config file
export default defineConfig({
  unstated: {
    /**
     * global: boolean | string[]
     * 1. 若值为true，会把uModels下所有合法文件的默认导出全部注册到全局（不推荐）
     * 2. 若值为sting[]，会把列表中存在的注册到全局，剩下的用户自行处理（性能较好）
     * 3. uModels所有合法文件都会注册为Container并添加到umi下，导出key为unstatedModels（import { unstatedModels } from 'umi'）
     */
    global: ['global'],
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
import { unstatedModels } from 'umi';

const App = () => {
  const { global } = unstatedModels.global.useContainer();
  return <div>{global}</div>;
};
```

1. 在页面中使用。如果 model 未全局注册，使用如下

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
import { unstatedModels } from 'umi';

const ChildComponent = () => {
  const { exampleState } = unstatedModels.example.useContainer();
  return (
    <div>
      child: {exampleState}
    </div>
  )
}
const MyComponent = () => {
  const { exampleState } = unstatedModels.example.useContainer();
  return (
    <div>
      {exampleState}
      <ChildComponent/>
    </div>
  )
}

export default () => unstatedModels.example.wrapProvider(<MyComponent/>)
```
