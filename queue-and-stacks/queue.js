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