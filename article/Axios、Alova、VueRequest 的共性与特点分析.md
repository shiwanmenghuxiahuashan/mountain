### 一、Axios、Alova、VueRequest 的共性与特点分析

#### 1. 共性

* **请求拦截器与响应拦截器**：三者均支持全局或局部请求/响应拦截逻辑。
* **Promise 封装**：基于 Promise 实现异步请求管理。
* **轻量化设计**：均追求核心功能的简洁性，通过插件或扩展机制提供高级功能。
* **多环境支持**：兼容浏览器、Node.js（Axios）或 SSR 场景（Alova）。
* **错误处理**：统一的错误捕获和回调机制。
* **TypeScript 支持**：提供类型定义。

#### 2. 特点对比

| 特性               | Axios                | Alova              | VueRequest         |
|--------------------|----------------------|--------------------|--------------------|
| **核心定位**        | 通用 HTTP 客户端     | 轻量级请求策略库   | Vue 生态专用工具   |
| **高级功能**        | 拦截器、取消、适配器 | 缓存、自动重试、SSR| 自动请求、分页管理 |
| **数据缓存**        | 需手动实现           | 内置缓存策略       | 响应式缓存管理     |
| **声明式 API**      | 命令式               | 声明式             | 组合式 API         |
| **生态集成**        | 跨框架               | 轻量级插件化       | 深度集成 Vue3      |

---

### 二、自定义请求库设计规划

#### 1. 目录结构

```bash
/src
├── core                 # 核心请求逻辑
│   ├── Request.js       # 请求基类
│   └── Scheduler.js     # 请求调度器（队列、并发控制）
├── interceptors         # 拦截器管理
│   ├── request          # 请求拦截器
│   │   ├── auth.js      # 认证处理
│   │   └── cache.js     # 缓存预处理
│   └── response         # 响应拦截器
│       ├── error.js     # 错误统一处理
│       └── format.js    # 数据格式化
├── plugins              # 可插拔功能模块
│   ├── retry.js         # 请求重试
│   ├── throttle.js      # 请求节流
│   └── redirect.js      # 重定向处理
├── utils
│   ├── cacheManager.js  # 缓存存储策略（内存/LocalStorage）
│   └── validator.js     # 请求参数校验
└── index.js             # 入口文件
```

#### 2. 核心功能设计

##### 请求拦截器链

```javascript
class InterceptorManager {
    constructor() {
        this.handlers = [];
    }

    use(fulfilled, rejected, phase = 'normal') {
        this.handlers.push({
            fulfilled,
            rejected,
            phase
        });
    }

    async run(context, type) {
        const chain = this.handlers.filter(h => h.phase === type);
        let promise = Promise.resolve(context);

        while (chain.length) {
            const {
                fulfilled,
                rejected
            } = chain.shift();
            promise = promise.then(
                ctx => fulfilled(ctx),
                err => rejected ? rejected(err) : Promise.reject(err)
            );
        }
        return promise;
    }
}
```

##### 多维度缓存策略

```javascript
class CacheManager {
    constructor(strategy = 'memory') {
        this.store = strategy === 'local' ? new LocalStorageCache() : new Map();
        this.maxAge = 300000; // 5分钟默认缓存
    }

    getKey(config) {
        return `cache_${hash(config.url + JSON.stringify(config.params))}`;
    }

    set(key, data, ttl) {
        this.store.set(key, {
            timestamp: Date.now(),
            expires: Date.now() + (ttl || this.maxAge),
            data
        });
    }

    get(key) {
        const item = this.store.get(key);
        return item?.expires > Date.now() ? item.data : null;
    }
}
```

#### 3. 高级特性实现

##### 请求重试（指数退避）

```javascript
function createRetryPlugin(retries = 3, delay = 1000) {
    return {
        onError: (error, config) => {
            if (!config.retryCount) config.retryCount = 0;

            if (config.retryCount < retries) {
                config.retryCount++;
                const backoff = delay * Math.pow(2, config.retryCount);
                return new Promise(resolve =>
                    setTimeout(() => resolve(this.request(config)), backoff)
                );
            }
            return Promise.reject(error);
        }
    };
}
```

##### 请求合并（防抖）

```javascript
const pendingRequests = new Map();

function mergeRequest(config) {
    const key = `${config.method}_${config.url}_${JSON.stringify(config.params)}`;

    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    } else {
        const promise = axios(config).finally(() => {
            pendingRequests.delete(key);
        });
        pendingRequests.set(key, promise);
        return promise;
    }
}
```

#### 4. 拦截器全生命周期处理

```typescript
interface InterceptorHandlers {
  onRequest?: (config: RequestConfig) => RequestConfig;
  onResponse?: (response: Response) => any;
  onError?: (error: Error) => Promise<never>;
  onTimeout?: (config: RequestConfig) => void;
  onCancel?: (reason: string) => void;
}

class EnhancedInterceptor {
  private phases: Map<string, Function[]> = new Map();

  register(phase: string, handler: Function) {
    if (!this.phases.has(phase)) this.phases.set(phase, []);
    this.phases.get(phase)?.push(handler);
  }

  async execute(phase: string, ...args: any[]) {
    const handlers = this.phases.get(phase) || [];
    let result = args[0];
    
    for (const handler of handlers) {
      try {
        result = await handler(result, ...args.slice(1));
      } catch (e) {
        this.emit('error', e);
        break;
      }
    }
    return result;
  }
}
```

#### 5. 请求调度器设计

```javascript
class RequestScheduler {
    constructor(maxConcurrent = 5) {
        this.queue = [];
        this.activeCount = 0;
        this.maxConcurrent = maxConcurrent;
    }

    enqueue(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                request,
                resolve,
                reject
            });
            this.dequeue();
        });
    }

    async dequeue() {
        if (this.activeCount >= this.maxConcurrent || !this.queue.length) return;

        this.activeCount++;
        const {
            request,
            resolve,
            reject
        } = this.queue.shift();

        try {
            const result = await request();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.activeCount--;
            this.dequeue();
        }
    }
}
```

### 三、差异化优势

1. **模块化插件系统**：通过 `plugins/` 目录实现功能解耦，用户可按需加载
2. **智能缓存策略**：支持内存/持久化双模式，自动识别 GET 请求缓存
3. **全链路可观测**：提供完整的拦截器生命周期事件监控
4. **自适应并发控制**：动态调整请求队列优先级
5. **SSG/SSR 优化**：内置服务端渲染场景的缓存同步机制

### 四、技术选型建议

* **核心通信**：使用 Fetch API 作为基础，保留 Axios 适配器兼容层
* **响应式支持**：提供可选 Vue/React 响应式绑定插件
* **TypeScript**：完全使用 TypeScript 开发，提供严格类型定义
* **Tree Shaking**：通过 ES Module 实现按需加载
* **性能监控**：集成 Performance API 进行请求耗时分析

该设计通过分层架构实现功能解耦，结合拦截器全生命周期管理覆盖所有用户场景需求，同时保持核心体积小于 10KB（gzip）。
