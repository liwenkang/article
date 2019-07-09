// 标准的 promise 调用方法
```js
var promise1 = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('foo');
    }, 300);
});

promise1.then(function(value) {
    console.log(value);
    // expected output: "foo"
});

console.log(promise1);
// expected output: [object Promise]
```

首先是 promise 框架
```js
function MyPromise(executor) {
    var self = this
    // promise 当前状态
    self.status = 'pending'
    // promise 当前值
    self.data = undefined
    // Promise resolve时的回调函数集
    // 因为在Promise结束之前有可能有多个回调添加到它上面
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    executor(resolve, reject) // 执行executor并传入相应的参数
}
```

接下来需要定义 resolve 和 reject,以及对于错误需要处理
```js
function MyPromise(executor) {
    var self = this
    // promise 当前状态
    self.status = 'pending'
    // promise 当前值
    self.data = undefined
    // Promise resolve时的回调函数集
    // 因为在Promise结束之前有可能有多个回调添加到它上面
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        // 从 pending => resolved
        if (self.status === 'pending') {
            self.status = 'resolved'
            self.data = value
            for (var i = 0; i < self.onResolvedCallback.length; i++) {
                self.onResolvedCallback[i](value)
            }
        }
    }

    function reject(reason) {
        // 从 pending => rejected
        if (self.status === 'pending') {
            self.status = 'rejected'
            self.data = reason
            for (var i = 0; i < self.onRejectedCallback.length; i++) {
                self.onRejectedCallback[i](reason)
            }
        }
    }

    try {
        executor(resolve, reject) // 执行executor并传入相应的参数
    } catch (e) {
        reject(e)
    }
}
```

此处,promise 的状态是可以通过外部修改的,此处的实现没有考虑这个问题
接下来实现 then 
```js
MyPromise.prototype.then = function (onResolved, onRejected) {
    var self = this
    var promise2

    // 2.2.1 如果 onResolved, onRejected 不是函数,就把参数往下传递(实现值的穿透)
    onResolved = typeof onResolved === 'function' ? onResolved : value => { return value }
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    // promise 有三种可能的状态
    if (self.status === 'pending') {
        // 此处的 promise 的状态还是 pending ,需要状态确认后,才知道调用 onResolved 还是 onRejected,所以我们需要把两种情况的处理逻辑作为回调传入 this 的回调数组
        return promise2 = new MyPromise((resolve, reject) => {
            self.onResolvedCallback.push(() => {
                try {
                    var x = onResolved(self.data)
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject)
                    } else {
                        // todo 这里没做处理
                        resolve(x)
                    }
                } catch (e) {
                    reject(x)
                }
            })

            self.onRejectedCallback.push(() => {
                try {
                    var x = onRejected(self.data)
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject)
                    } else {
                        reject(x)
                    }
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    if (self.status === 'resolved') {
        // 此处已经 resolved ,需要调用 onResolved
        return promise2 = new MyPromise((resolve, reject) => {
            try {
                var x = onResolved(self.data)
                if (x instanceof MyPromise) {
                    // 如果 onResolved 的返回值是一个 Promise 对象，直接取这个 promise 对象的结果作为 promise2 的结果
                    x.then(resolve, reject)
                } else {
                    // 否则，以 onResolved 的返回值作为 promise2 的结果
                    resolve(x)
                }
            } catch (e) {
                reject(e)
            }
        })
    }

    if (self.status === 'rejected') {
        // 此时已经 rejected ,需要调用 onRejected
        return promise2 = new MyPromise((resolve, reject) => {
            try {
                var x = onRejected(self.data)
                if (x instanceof MyPromise) {
                    x.then(resolve, reject)
                } else {
                    // todo 这里为什么没做处理?
                    reject(x)
                }
            } catch (e) {
                reject(e)
            }
        })
    }
}

MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}
```
