var MyPromise = (() => {
    function MyPromise(resolver) {
        if (typeof resolver !== 'function') {
            throw new TypeError('Promise resolver ' + resolver + ' is not a function')
        }
        if (!(this instanceof MyPromise)) return new MyPromise(resolver)

        var self = this
        self.callbacks = []
        self.status = 'pending'

        // 四种情况
        // 同步 resolve => 同步 then
        // 同步 resolve => 异步 then
        // 异步 resolve => 同步 then
        // 异步 resolve => 异步 then
        // 所以 resolver 必须同步调用 , then 里的必须异步执行
        function resolve(value) {
            // 这里面的函数必须异步执行
            setTimeout(() => {
                if (self.status !== 'pending') {
                    return
                }
                self.status = 'resolved'
                self.data = value

                // 遍历数组,把每个函数调用一遍
                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onResolved(value)
                }
            })
        }

        function reject(reason) {
            setTimeout(() => {
                if (self.status !== 'pending') {
                    return
                }
                self.status = 'rejected'
                self.data = reason

                for (var i = 0; i < self.callbacks.length; i++) {
                    self.callbacks[i].onRejected(reason)
                }
            })
        }

        // 因为 resolver 是别人传过来的,所以需要处理错误
        try {
            // 同步执行
            resolver(resolve, reject) // 执行executor并传入相应的参数
        } catch (e) {
            // 将抛出的错误 e 作为 reject 的原因
            reject(e)
        }
    }

    function resolvePromise(promise2, x, resolve, reject) {
        // 为了让不同的 promise 之间可以交互
        var then
        // 2.3.3.3.3 thenCalledOrThrow 用来记录是否是第一次调用
        var thenCalledOrThrow = false

        if (promise2 === x) {
            reject(new TypeError('Chaining cycle detected for promise!'))
            return
        }

        if (x instanceof Promise) {
            x.then(resolve, reject)
            return
        }

        if ((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
            try {
                // 如果 x 有一个 then 方法 ,假设 x 是一个 promise 那么 promise2 取得 x 的状态
                // 如果 then 是一个 getter ,那么读很多次,就会有副作用
                then = x.then
                if (typeof then === 'function') {
                    then.call(x, y => {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        // 三者之一触发后,状态就固定了
                        return resolvePromise(promise2, y, resolve, reject)
                    }, r => {
                        if (thenCalledOrThrow) return
                        thenCalledOrThrow = true
                        // 三者之一触发后,状态就固定了
                        return reject(r)
                    })
                } else {
                    return resolve(x)
                }
            } catch (e) {
                if (thenCalledOrThrow) return
                thenCalledOrThrow = true
                // 三者之一触发后,状态就固定了
                return reject(e)
            }
        } else {
            // 2.3.4 If x is not an object or function, fulfill promise with x.
            return resolve(x)
        }
    }

    MyPromise.prototype.then = function (onResolved, onRejected) {
        // onResolved 成功的回调
        // onRejected 失败的回调
        // 2.2.1 如果 onResolved, onRejected 不是函数,就忽略
        onResolved = typeof onResolved === 'function' ? onResolved : value => {
            return value
        }
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        }

        var self = this
        var promise2
        // promise 有三种可能的状态
        if (self.status === 'pending') {
            return promise2 = new MyPromise((resolve, reject) => {
                self.callbacks.push({
                    onResolved: function () {
                        try {
                            var x = onResolved(self.data)
                            // 根据 x 的值来决定 promise2 的状态的函数
                            // resolvePromise
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            return reject(x)
                        }
                    },
                    onRejected: function (reason) {
                        try {
                            var x = onRejected(reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            return reject(e)
                        }
                    }
                })
            })
        }

        if (self.status === 'resolved') {
            // 此处已经 resolved ,需要调用 onResolved
            return promise2 = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        var x = onResolved(self.data)
                        // 这里的 x 可能是一个值, 也可能是一个 promise
                        resolvePromise(promise2, x, resolve, reject)
                        /*
                         *   if (x instanceof MyPromise) {
                         *       // x 是一个 promise,那么要拿到 promise 返回的值
                         *       x.then(function (value) {
                         *       // x 成功,调用 resolve
                         *           resolve(value)
                         *       }, function (reason) {
                         *       // x 失败,调用 reject
                         *           reject(reason)
                         *       })
                         *       // 上面可以简写为 x.then(resolve, reject)
                         *   } else {
                         *       // x 是一个普通的值,直接返回
                         *       resolve(x)
                         *   }
                         */
                    } catch (e) {
                        return reject(e)
                    }
                })
            })
        }

        if (self.status === 'rejected') {
            // 此时已经 rejected ,需要调用 onRejected
            return promise2 = new MyPromise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        var x = onRejected(self.data)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        return reject(e)
                    }
                })
            })
        }
    }

    MyPromise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected)
    }

    MyPromise.deferred = MyPromise.defer = function () {
        var dfd = {}
        dfd.promise = new MyPromise(function (resolve, reject) {
            dfd.resolve = resolve
            dfd.reject = reject
        })
        return dfd
    }

    try { // CommonJS compliance
        module.exports = MyPromise
    } catch (e) {
    }

    return MyPromise
})()
