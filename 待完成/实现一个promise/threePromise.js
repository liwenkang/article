function RESOLVE_PROMISE(promise2, x, resolve, reject) {
    var then
    var called = false

    if (promise2 === x) {
        // 相等的情况下
        return reject(new TypeError('报错信息'))
    }

    if (x instanceof MyPromise) {
        if (x.status === 'pending') {
            x.then(v => {
                RESOLVE_PROMISE(promise2, v, resolve, reject)
            }, reject)
        } else {
            x.then(resolve, reject)
        }
        return
    }

    if (x !== null && ((typeof x === 'object') || (typeof x === 'function'))) {
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
                return reject(e)
            }
        }
    } else {
        resolve(x)
    }
}

function MyPromise(executor) {
    var self = this
    self.status = 'pending'

    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        if (value instanceof MyPromise) {
            return value.then(resolve, reject)
        }
        // 异步的
        setTimeout(() => {
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
        // 异步的
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

    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved === "function" ? onResolved : value => {
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    }

    var self = this
    var promise2

    // 分类讨论
    if (self.status === 'pending') {
        // 此时不知道将会成为什么状态,所以要存入数组中保存
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
        // 已经确定是 resolved 了, 那就执行 onResolved, 注意返回的还是 promise
        return promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    var x = onResolved(self.data)
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

    return promise2
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

