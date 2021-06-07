基于Vue.js的企业级前端代码架构设计设想 http://www.uml.org.cn/AJAX/201905093.asp
领域驱动的 Vue.js 架构 https://medium.com/bauer-kirch/a-domain-driven-vue-js-architecture-77771c20f0da



前面说了，vue能够解决的问题更多是偏向于视图层，如果前端将业务代码与视图层代码全部写到一个vue文件中，那么这个文件将可能变得非常庞大，同样导致系统的复杂度变高，变得难以维护，业务代码之间的复用性也会变低，导致冗余代码过多。

首先还是利用分层的思想，实现代码的逻辑分层，然后结合vue和ES6的优势，将代码模块化，使得整个代码结构清晰明了，易维护。首先笔者将各个分层结构展示给大家：

该结构整体是由vue-cli进行创建，vue-cli生成的代码在这里就不做过多的解释，前端重点放在src文件夹中。

components：
//组件 设置
组件存放目录。主要存放各个模块需要用到的vue组件，组件的划分应该有：公共组件、模块组件，命名规则可以如下：

+components

-common

-module(模块名称, 如：login)

组件的命名规则应该让人能很容易判断出来该文件的类型属于组件，如：HelloWorldComponent.vue。

consts：

静态变量存放目录。主要存放系统需要利用到的各种静态变量，如：后端请求的路径。在其他语言开发中，有一点是非常忌讳的，那就是魔法值，魔法值会使代码的可读性降低，增加维护成本；而且一旦变量不只在一个地方用到，在多处或者多个文件，一旦涉及到该变量的变更就会导致多处修改，又增加了维护成本，容易导致新的Bug出现。

下面给出一个命名规则示例代码：

```javascript
/**
 * 以类的方式进行封装，类名的命名规则为变量作用类型+Constant，容易一眼看出来该类的用处和作用范围
 */
class RequestConstant {
    /**
     * 根据process.env. NODE_ENV的值确定网关地址，可以保证两种环境下的切换，避免了因为人为忘记修改该值，导致部署生产环境时出错
     */
    static DOMAIN_URL = process.env.NODE_ENV == 'development'
    '我是开发环境下的配置': '我是生产环境下的配置';
    /**
     * 请求的路径
     */
    static SAY_HELLO_PATH = '/mock/sayHello';
}

export default RequestConstant;
```

libs：

库文件存放目录。在开发过程中总会遇到需要引入一些其他外部的库，而这些库在npm仓库中却又不存在，这个目录的用处就主要用来放置这些库文件。

mock：

mock模拟数据接口目录。用于提供模拟数据，方便测试。

plugins：

vue插件存放目录。主要存放一些比较通用的插件，命名规则可以如下：

插件用途+Plugin，如：ErrorMsgPlugin.js

router：

vue路由文件存放目录。一般一个就够，当然，如果系统够大，那么拆分也是有必要的，如果拆分路由文件的话，建议采用模块名+Router的方式。

services：

业务逻辑层。这层的主要目的就是为了将视图层与业务逻辑层解耦而划分出来，因为vue所代表的视图层已经承担了不少视图层的工作，不应该还让视图层承担业务逻辑层的工作，如：

视图层需要加载后端请求的数据，请求之后还需要做判断是否成功，返回的结果是否满足视图层的需要，如果不满足是否需要再做转换，这一系列的业务操作如果放在视图层，那么视图层就会变得非常庞大。业务层的文件划分应该更偏向于模块，而视图层文件则是根据项目需求的页面来定，一个模块可以只有一个页面也可以同时拥有几个页面。业务层应该具备这种复用性，方便模块之间调用，如果将业务层代码直接写入视图层，那么业务层的复用性直接就被降低，还会让视图层显得非常臃肿，代码维护难度也随之上升。假设A、B两个页面需要同时调用一段相同的方法，而这个代码不会涉及到任何视图相关的内容，如果在A、B页面里面都写上这段代码，那么一旦涉及代码修改，带来的变动就不再是单纯的一个页面，而是A、B两个，倘若这段代码使用率极高，那么带来的问题将会是巨大的。

在设计的过程中，前端还应该考虑两个原则：单一职责原则、最少知识原则。如果视图层与业务层耦合，那么视图层和业务层的职责不在单一，同时也违背了对象之间最少了解的原则。

下面给出一个业务层设计参考代码：

```javascript
import RequestUtil from '../utils/RequestUtil'

import RequestConstant from '../consts/RequestConstant'
/**
 * 模块名+Service的命名规则
 */
class HelloWorldService {

    /**
     * 初始化实例变量
     */
    constructor(_this) {
        this.requestUtil = new RequestUtil();
        this._this = _this;
    }
    /**
     * 业务逻辑层的方法
     * 视图层只需要知道调用该方法就行，至于该方法里面的代码是如何成功实现返回是不需要视图层关心的
     */
    sayHello() {
        console.log(this._this);
        return 'hello';
    }

    /**
     * 该方法涉及到了异步回调，回调函数只需要关心回调的结果是视图层想要的
     * RequestConstant. SAY_HELLO_PATH接口路径变量其实是业务层需要知道的，视图层则是不需要关心数据是从哪个接口过来的
     */
    sayAsyncHello(callBack) {
        this.requestUtil.getRequest(RequestConstant.SAY_HELLO_PATH, {},
            function(data) {
                let newObjArr = new Array();
                newObjArr.push(data);
                //转换数据格式，满足视图层需要
                callBack(newObjArr);
            });
    }

}
```

export default HelloWorldService; 
 

store：

vuex状态管理器。如果模块较多可以按模块划分子文件夹，子文件较多的情况下命名规则建议：模块名+Store

utils：

工具类存放目录。主要放一些系统需要用到的通用小工具。如：http请求工具类、日期格式化工具类等。

views：

视图文件存放目录。如果视图较多可以划分模块子文件夹。

以上内容都是笔者自己在进行项目开发过程中总结的一些经验，当然了，有可能会存在一些不太合适的地方，欢迎大家一起对前端架构进行探讨，创造更加完美的前端架构设计方案。
