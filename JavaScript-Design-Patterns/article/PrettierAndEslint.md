# Prettier + Eslint
https://jishuin.proginn.com/p/763bfbd60489
## 是什么

### Eslint

 [Eslint](https://eslint.org/docs/user-guide/getting-started) 是一个集代码审查和修复的工具，它的核心功能是通过配置一个个规则来限制代码的合法性和风格。

#### 解析器

 ESLint 使用Espree进行 JavaScript 解析。
 除了使用 ESLint 自带的解析器外，还可以指定其他解析器：

* @babel/eslint-parser：使 Babel 和 ESLint 兼容，对一些 Babel 语法提供支持; 
* @typescript-eslint/parser：TypeScript 提供了此解析器用于将其与 ESTree 兼容，使 ESLint 对 TypeScript 进行支持; 

#### 指定解析器的原则

* 如果你的项目用到了比较新的 ES 语法，那就可以指定 @babel/eslint-parser 为解析器; 
* 如果项目是基于 TS 开发的，那就可以指定 @typescript-eslint/parser 为解析器; 

#### 解析器参数配置 parserOption
```json
{
    // ESLint 默认解析器，也可以指定成别的
    parser: "espree", 
    // ESLint 解析器参数
    parserOption: {
        // 指定要使用的 ECMAScript 版本，默认值 5
        ecmaVersion: 5,
        // 设置为 script (默认) 或 module（如果你的代码是 ECMAScript 模块)
        sourceType: "script",
        // 这是个对象，表示你想使用的额外的语言特性,所有选项默认都是 false
        ecmafeatures: {
            // 是否允许在全局作用域下使用 return 语句
            globalReturn: false,
            // 是否启用全局 strict 模式（严格模式）
            impliedStrict: false,
            // 是否启用JSX
            jsx: false,
            // 是否启用对实验性的objectRest/spreadProperties的支持
            experimentalObjectRestSpread: false
        }
    }
}
```

## Prettier（Code formatter） + Eslint

代码格式化和代码检查，保证代码风格和代码质量。此处落地主要是配置相关插件和格式化要求。

### 代码风格不一致带来的问题

1. git diff 的时候会导致很多仅仅是格式的修改出现。例如:缩进风格，函数换行等。
2. 每个团队有自己的标准导致新人的加入需要花很大时间熟悉代码风格

## 添加 Prettier 到依赖

**在每个项目中本地安装Prettier很重要，这样每个项目都会获得精确的 Prettier 版本。**

```bash
# --dev 添加为开发依赖
# --exact 添加为精确版本
yarn add --dev --exact prettier
```

1. 创建配置文件 `.prettierrc.json` 用以格式化方案 
2. 创建忽略文件 `.prettierignore `用以忽略不想格式化的文件

使用 Prettier 格式化所有文件

```bash
#npx 
npx prettier --write .
#yarn
yarn prettier --write .

#运行 prettier --write app/ 来格式化某个目录
#使用像 globd的路径语法 prettier --write "app/**/*.test.js" 格式化某种文件
```

### 编辑器集成

[prettier-vscode](https://github.com/prettier/prettier-vscode)

` prettier ` 扩展将使用项目的本地依赖项中的 prettier。

**当 ` prettier.resolveGlobalModules ` 设置为true扩展时也可以尝试解析全局模块。**
如果vscode未安装 `prettier ` , 在VS Code中：启动VS Code Quick Open（Ctrl+P），粘贴以下命令，回车

```
ext install esbenp.prettier-vscode
```

`ctrl + ,  ` 快捷键打开设置 ，点击左上方**打开设置(json)** 查看 ` settings.json ` ，搜索 ` [javascript] ` 设置默认格式化工具和 js默认格式化工具为 prettier

```json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

下面将对除 Javascript 之外的所有语言使用 Prettier。

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": null
  }
}
```

以下将仅将 Prettier 用于 Javascript。

```json
{
  "editor.defaultFormatter": null,
  "[javascript]": {
    "editor.defaultFormatter":  "esbenp.prettier-vscode"
  }
}
```

### eslint集成

[ eslint-config-prettier](https://github.com/prettier/eslint-config-prettier#installation) 让 ESLint 和 Prettier 相互配合，它关闭所有不必要的或可能与 Prettier 冲突的 ESLint 规则.

```bash
# 添加到依赖
yarn add  --dev eslint-config-prettier
```

将 `"prettier"` 添加到 `.eslintrc.*` 文件中的 `"extends"` 数组。确保把它放在最后，这样它就有机会覆盖其他配置。

```json
{
  "extends": [

    "some-other-config-you-use",
    "prettier"

  ]
}

```

### Git hooks

TDDO

## 添加 eslint 到依赖

[eslint](https://eslint.org/)

https://www.npmjs.com/package/eslint-config-standard

```bash
yarn add eslint -D
```

设置配置文件：

```bash
$ ./node_modules/.bin/eslint --init
#或者
npx eslint --init
```

该命令会以提问的形式引导你生成 eslint 配置文件 `.eslintrc.js`

```bash
# 检查指定文件
npx eslint yourfilepath

# 通过添加 --fix 命令可以进行修复
npx eslint --fix yourfilepath
```
