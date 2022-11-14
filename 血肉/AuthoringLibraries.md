# 创建库

webpack 可以用于打包 JavaScript library，

## 快速开始

在指定目录下进行基本初始化、安装依赖

```bash
yarn init  -y 
yarn add  webpack webpack-cli --dev
yarn add lodash

```

运行完毕后会生成 `package.json` 文件如下：

```json
{
  "name": "socar-utils",
  "version": "1.0.0",
  "description": "socar utils 相关",
  "main": "src/index.js",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^5.75.0",
    "webpack-cli": "^4.10.0"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  }
}

```

### src/index.js

```js
// src/index.js
import _ from "lodash";

function demo() {
    return _.join(["Hello", "webpack"], " ");
}

console.log(demo());
```

此时运行 

```
yarn webpack
```

`webpack ` 会生成一个dist 文件夹，里面会包含 ` index.js ` 和 ` lodash` 打包在一起的的 `main.js` 文件。 

## 使用配置文件

根目录下与 `package.json` 同级别新增 `webpack.config.js` 文件

### webpack.config.js

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js', // filename 文件名，打包出的文件名，非包名
        path: path.resolve(__dirname, 'dist'),
        library: 'webpackNumbers',
    },
};
```

上述配置告诉 webpack 将 src/index.js 打包到 dist/index.js 中。

###  library type

上述配置打包结果只在通过脚本标签引用时有效，它不能在其他环境中使用，如CommonJS, AMD, Node.js等。

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: "this", // +
        library: { // +
            name: 'libraryName', // +
            type: 'umd', // +
        }, // +
    }
};
```

上述配置打包结果即是在CommonJS, AMD, 和 script 标签下可以工作的包.

运行 `yarn webpack` 即可输出新的打包结果。

## 外部化依赖

现在配置创建的是一个较大的， `lodash` 已和 `src/index.js` 一起打包。

`lodash` 是较为流行且通用的工具包，很多第三方 库/包 ( `library` ) 都会将其作为依赖，因此可以将 `lodash` 视为对等依赖，这意味着用户应该已经安装了 `lodash` 。

因此可以将这个外部库的控制权让渡给 库/包 ( `library` ) 的使用者。

上述内容可以通过外部配置来实现:

### webpack.config.js

```js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: "this",
        library: {
            name: 'libraryName',
            type: 'umd',
        },
    },
    externals: { // +
        lodash: { // +
            commonjs: 'lodash', // +
            commonjs2: 'lodash', // +
            amd: 'lodash', // +
            root: '_', // +
        }, // +
    }, // +
};
```
这意味着库期望在消费者环境中有一个名为 ` lodash `的依赖项可用。

# 参考资料

[Authoring Libraries](https://webpack.js.org/guides/author-libraries/#authoring-a-library)

[package-json](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)

[package-json peerdependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies)

[webpack-configuration-mode](https://webpack.js.org/configuration/mode/
)
