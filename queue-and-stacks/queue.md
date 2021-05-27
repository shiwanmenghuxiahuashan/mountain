# 队列是先入先出的数据结构

在 FIFO 数据结构中，将首先处理添加到队列中的第一个元素。

![FIFO](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/08/14/screen-shot-2018-05-03-at-151021.png)

如上图所示，队列是典型的 FIFO 数据结构。插入（insert）操作也称作入队（enqueue），新元素始终被添加在队列的末尾。 删除（delete）操作也被称为出队（dequeue)。 你只能移除第一个元素。

![git 图示](https://pic.leetcode-cn.com/44b3a817f0880f168de9574075b61bd204fdc77748d4e04448603d6956c6428a-%E5%87%BA%E5%85%A5%E9%98%9F.gif)

# 队列实现

为了实现队列，我们可以使用动态数组和指向队列头部的索引。

如上所述，队列应支持两种操作：入队和出队。入队会向队列追加一个新元素，而出队会删除第一个元素。
 ~~所以我们需要一个索引来指出起点。~~

```javascript 
//简单的队列
class Queue {

    list = [];
    //入队
    enQueue(member) {
        this.list.push(member);
    };
    //出队
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
        return this.list.length > 0;
    }
    //重置队列
    reset() {
        this.list = [];
    }
    //输出队列
    output() {
        console.log(this.list)
    }

}; 
//demo
// let myQueue = new Queue()
// myQueue.enQueue('John', 2)
// myQueue.enQueue('Jack', 1)
// myQueue.enQueue('Camila', 1)
// myQueue.enQueue('Surmon', 3)
// myQueue.enQueue('skyRover', 2)
// myQueue.enQueue('李重楼', 1)
// myQueue.output()
// console.log(myQueue.size)
// console.log(myQueue.front())

```

 

# 循环队列

当我们有空间限制时，不能无休止的向队列中push队员，会占用过多的内存，所以提出了循环队列的概念。

~~js中不存在shift后空间被浪费的概念~~

具体来说，我们可以使用固定大小的数组。 目的是节约存储。

让我们通过一个示例来查看循环队列的工作原理。 你应该注意我们入队或出队元素时使用的策略。

[LeetCode 动态演示](https://leetcode-cn.com/leetbook/read/queue-stack/kgtj7/)

静态示例
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
