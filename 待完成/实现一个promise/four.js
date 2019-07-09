function MyPromise(executor) {
    var self = this
    self.status = 'pending'

    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        if (value instanceof MyPromise) {
            // 如果传入的本身就是一个 promise,那么应该返回这个 promise 的结果
            value.then(resolve, reject)
        }
        // 这里应该是异步的
        setTimeout(() => {
            // 改变状态,然后把 onResolvedCallback 里的内容都执行一遍
            if (self.status === 'pending') {
                self.status = 'resolved'
                self.data = value

                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        })
    }

    function reject(reason) {
        // 这里应该是异步的
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason

                for (var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](reason)
                }
            }
        })
    }

    // 因为此处的 executor 是外界传入的,所以需要有异常处理
    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
    // 对 onResolved 和 onRejected 进行处理
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    }

    var self = this
    var promise2

    // 在 then 中有三种情况, pending, resolved, rejected

    if (self.status === 'pending') {
        // 这里不确定是 成功 还是 失败,所以把它存起来
        return promise2 = new MyPromise((resolve, reject) => {
            self.onResolvedCallback.push(value => {
                try {
                    var x = onResolved(value)
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallback.push(reason => {
                try {
                    var x = onRejected(reason)
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    if (self.status === 'resolved') {
        // 此处直接调用 resolved
        return promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    var x = onResolved(self.data)
                    // 这里对于不同的 x 返回不同的 promise
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    if (self.status === 'rejected') {
        return promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    var x = onRejected(self.data)
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }
}

function RESOLVE_PROMISE(promise2, x, resolve, reject) {
    // 根据 x 决定 promise2 的状态
    if (promise2 === x) {
        reject(new TypeError('wrong'))
    }

    var then
    var called = false

    if (x instanceof MyPromise) {
        // 还是 promise
        if (x.status === 'pending') {
            x.then(v => {
                RESOLVE_PROMISE(promise2, v, resolve, reject)
            }, reject)
        } else {
            x.then(resolve, reject)
        }
    }

    if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
        try {
            then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) {
                        return
                    } else {
                        called = true
                        return RESOLVE_PROMISE(promise2, y, resolve, reject)
                    }
                }, r => {
                    if (called) {
                        return
                    } else {
                        called = true
                        return reject(r)
                    }
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) {
                return
            } else {
                called = true
                reject(e)
            }
        }
    } else {
        resolve(x)
    }
}

MyPromise.deferred = MyPromise.defer = function () {
    var dfd = {}
    dfd.promise = new MyPromise(function (resolve, reject) {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

try {
    module.exports = MyPromise
} catch (e) {
}
