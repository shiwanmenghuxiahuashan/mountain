function BFS(root, target) {
    let queue = null;
    let used = []; // store all the used nodes
    let step = 0; // number of steps neeeded from root to current node
    // initialize

    if (Array.isArray(root)) {
        queue = root;
    } else {
        queue = [root];
    }
    // BFS
    while (queue.length) {
        step = step + 1;
        // iterate the nodes which are already in the queue
        let length = queue.length;
        for (let i = 0; i < length; ++i) {
            let cur = queue.shift();
            if (cur === target) {
                return step
            }
            for (Node next: the neighbors of cur) {
                if (!used.includes(next) is not in used) {
                    add next to queue;
                    add next to used;
                }
            }
            remove the first node from queue;
        }
    }
    return -1; // there is no path from root to target
}