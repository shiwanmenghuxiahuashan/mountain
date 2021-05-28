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
    //输出队列
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