# 队列是先入先出的数据结构

在 `FIFO` 数据结构中，将首先处理添加到队列中的第一个元素。

![ `FIFO` ](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/08/14/screen-shot-2018-05-03-at-151021.png)

如上图所示，队列是典型的 `FIFO` 数据结构。插入（insert）操作也称作入列（enqueue），新元素始终被添加在队列的末尾。 删除（delete）操作也被称为出列（dequeue)。 你只能移除第一个元素。

![git 图示](https://pic.leetcode-cn.com/44b3a817f0880f168de9574075b61bd204fdc77748d4e04448603d6956c6428a-%E5%87%BA%E5%85%A5%E9%98%9F.gif)

## 队列实现

为了实现队列，我们可以使用动态数组和指向队列头部的索引。

如上所述，队列应支持两种操作：入列和出列。入列会向队列追加一个新元素，而出列会删除第一个元素。

> 大多数流行语言都提供内置的队列库，因此您无需重新发明轮子。

js中的 `Array` 原型中提供了入列 `push` 方法，出列 `shift` 方法 , 直接使用即可。

```javascript 
//简单的队列
class Queue {

    list = [];
    //入列
    enQueue(member) {
        this.list.push(member);
    };
    //出列
    deQueue() {
        if (this.isEmpty()) {
            return false;
        }
        this.list.shift();
        return true;
    }
    //get 将定义一个属性，获取队列长度
    get size() {
        return this.list.length;
    }
    //获取队列前排第一个
    front() {
        return this.list[0];
    }
    //是否为空
    isEmpty() {
        return this.list.length == 0;
    }
    //重置队列
    reset() {
        this.list = [];
    }
    //输出列列
    output() {
        console.log(this.list)
    }

}; 
//demo
// let myQueue = new Queue()
// myQueue.enQueue('John')
// myQueue.enQueue('Jack')
// myQueue.enQueue('Camila')
// myQueue.enQueue('Surmon')
// myQueue.enQueue('skyRover')
// myQueue.enQueue('李重楼')
// myQueue.output()
// console.log(myQueue.size)
// console.log(myQueue.front())

```

 

## 循环队列

当我们有空间限制时，不能无休止的向队列中 `push` 队员，会占用过多的内存，所以提出了循环队列的概念。

循环队列是一种线性数据结构，其操作表现基于  `FIFO` （先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为 **“环形缓冲器”**。

~~js中不存在shift后空间被浪费的概念~~

具体来说，我们可以使用固定大小的数组,限制其入列成员数量。目的是节约存储。

让我们通过一个示例来查看循环队列的工作原理。 你应该注意我们入列或出列元素时使用的策略。

[LeetCode 动态演示](https://leetcode-cn.com/leetbook/read/queue-stack/kgtj7/)

### 静态示例

``` js
//约定队列长队为5

//依次入列 1,2,3,4,5 ,结果如下:
[1,2,3,4,5]

//入列A，队列满了,则出列,结果如下:
[2,3,4,5]

//此时入列 A， 结果如下：
[2,3,4,5,"A"]

//依次入列，B,C 队列仍满，则先出列，再入列，结果如下：
[4,5,"A","B","C"]

//执行两次出列，结果如下：
["A","B","C"]

//依次入列 1,2,结果如下：
["A","B","C",1,2]

//依次入列3,4,队列满了,则出列,结果如下：
["C",1,2,3,4]

//就是这样
```

## 循环队列实现

```javascript
class MyCircularQueue {
    list = [];
    // MyCircularQueue(k): 构造器，设置队列长度为 k 。
    constructor(k) {
        if (!k) {
            throw new Error('k must')
        }
        this.limit = k;
    }
    // enQueue(member): 向循环队列插入一个元素。如果成功插入则返回真。
    enQueue(member) {
        if (this.isFull()) {
            this.deQueue();
        }
        this.list.push(member);
    };
    // deQueue(): 从循环队列中删除一个元素。如果成功删除则返回真。
    deQueue() {
        if (this.isEmpty()) {
            return false;
        }
        this.list.shift();
        return true;
    }
    //get 将定义一个属性，获取队列长度
    get size() {
        return this.list.length;
    }
    // Front: 从队首获取元素。如果队列为空，返回 -1 。
    Front() {
        let head = this.list[0];
        if (head) {
            return head;
        }
        return -1;
    }
    // Rear: 获取队尾元素。如果队列为空，返回 -1 。
    Rear() {
        let tail = this.list[this.size - 1];
        if (tail) {
            return tail;
        }
        return -1;
    }
    // isEmpty(): 检查循环队列是否为空。
    isEmpty() {
        return this.size == 0;
    }
    // isFull(): 检查循环队列是否已满。
    isFull() {
        return this.limit == this.size;
    }
    //重置队列
    reset() {
        this.list = [];
    }
    //输出列列
    output() {
        console.log(this.list)
    }
};

// let myQueue = new MyCircularQueue(5);
// //依次入列 1,2,3,4,5 
// myQueue.enQueue(1)
// myQueue.enQueue(2)
// myQueue.enQueue(3)
// myQueue.enQueue(4)
// myQueue.enQueue(5)
// //结果如下: [1,2,3,4,5]
// myQueue.output()
// //此时入列 A， 结果如下：[2,3,4,5,"A"]
// myQueue.enQueue("A")
// myQueue.output()
// //依次入列，B,C 队列仍满，则先出列，再入列，结果如下：[4,5,"A","B","C"]
// myQueue.enQueue("B")
// myQueue.enQueue("C")
// myQueue.output()
// //执行两次出列，结果如下：["A","B","C"]
// myQueue.deQueue()
// myQueue.deQueue()
// myQueue.output()
// //依次入列 1,2,结果如下：["A","B","C",1,2]
// myQueue.enQueue(1)
// myQueue.enQueue(2)
// myQueue.output()
// //依次入列3,4,队列满了,则出列,结果如下：["C",1,2,3,4]
// myQueue.enQueue(3)
// myQueue.enQueue(4)
// myQueue.output()
```

有些循环队列设计时，判断是否满，是否出列是交给实例去操作的。这一版是自动判断是否满，满则出列，腾出位置，然后入列新队员

# 队列和广度优先搜索

## 队列和 BFS
广度优先搜索（BFS）的一个常见应用是找出从根结点到目标结点的最短路径