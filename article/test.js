//基础 行为
/*jshint esversion: 8 */
// eslint-disable-next-line no-unused-vars
import {
    getOpenApiByResource
} from "@/api/base/SocarOpenApi";
// eslint-disable-next-line no-unused-vars
import {
    useRoute
} from "vue-router";
// eslint-disable-next-line no-unused-vars
import socarJsonApiParse from "@/api/base/SocarJsonApiParse";
// !!! PAGE 层会引用 组件层助手

//openapi
class BaseOpenApi {
    getOpenApiByApiLink(link = null) {
        return getOpenApiByResource(link);
    }
    //filterModel =>校验已有过滤是否在可操作的paramer中
    //根据 Parameter  构建JSON
}
class JsonApi extends BaseOpenApi {}

//基础服务 vue + socar
class BaseService {
    // store

    mounted() {
        throw new Error('BaseService mounted method is not function');
    }
    beforeUnmount() {
        throw new Error('BaseService beforeUnmount method is not function');
    }
    destory() {
        throw new Error('BaseService destory method is not function');
    }
}

// 2 Service.store
//大类展示
class Service extends BaseService {
    //  super();
    // constructor(){
    // }
    //不负责请求- 由实例去解决

    //Figuring 

}
class abstractPage {

}

/**
 * 一种实现
 */
class PageClass extends abstractPage {
    service = new service(); //??

    openApi = null;
    route = useRoute();
    constructor() {
        super();
        this.openApi = this.getOpenApiByApiLink();
    }
    getApiLink() {
        return this.route.meta ? .api.link || null;
    }

    isInited() {
        throw new Error('BaseService isInited method is not function');
    }
    async get() {
        const {
            data
        } = await this.openApi.get().catch((error) => {
            console.log(error.response)
        });
        return data
    }
    post() {
        throw new Error('BaseService post method is not function');
    }
    put() {
        throw new Error('BaseService put method is not function');
    }
    "delete"() {
        throw new Error('BaseService delete method is not function');
    }

    //!!!只定义影响PAGE DATA 的
    filterMdel() {
        //通用过滤模型
    }
    pagination() {
        //翻页
    }
    scrollInfinite() {
        // 滚动加载
    }
    // page 间共享的数据  如 v3中已选车型，全局的放到  APP 中去
    // service.store

}

//page 每个 dir 下一个
class Page extends PageClass {

    constructor() {
        super();

    }
    async init() {
        return await this.get();
    }
    //!!!每个PAGE中应有一个临时 store 用于共享对象信息，页面销毁时则销毁
    //provide / inject 实现  临时的，非长久存储的，如果长久存储，应该在page中存储

    //如何知道管理那些？
    //因此组件们就应该注册自己需要/可接受的数据到 Page类中

    //发出者怎么知道？
}

export {
    Page
}