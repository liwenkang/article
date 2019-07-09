function MyPromise(executor) {
    var self = this

    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        // 异步,里面就是把存起来的函数执行一遍
        if (value instanceof MyPromise) {
            return value.then(resolve, reject)
        }

        setTimeout(() => {
            if (self.status === 'pending') {
                // 状态改变后, 把缓存的函数执行一遍 todo
                self.status = 'resolved'
                self.data = value

                for (var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value)
                }
            }
        })
    }

    function reject(reason) {
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

function RESOLVE_PROMISE(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('wrong'))
    }

    var then
    var called = false

    if (x instanceof MyPromise) {
        if (x.status === 'pending') {
            x.then(v => {
                RESOLVE_PROMISE(promise2, v, resolve, reject)
            }, reject)
        } else {
            return x.then(resolve, reject)
        }
    }

    if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
        try {
            then = x.then
            if (typeof then === 'function') {
                then.call(x, value => {
                    if (called) {
                        return
                    } else {
                        called = true
                        return RESOLVE_PROMISE(promise2, value, resolve, reject)
                    }
                }, reason => {
                    if (called) {
                        return
                    } else {
                        called = true
                        // 注意这里直接返回的是错误的
                        return reject(reason)
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


MyPromise.prototype.then = function (onResolved, onRejected) {
    // 对传入的参数做处理
    onResolved = typeof onResolved === 'function' ? onResolved : value => {
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    }

    var self = this
    var promise2
    // 分类讨论
    if (self.status === 'pending') {
        // 此时状态还不确定,只能等到状态确定的时候,再执行
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
        // 状态已经确定,那就执行 onResolved ,注意返回的依然是 promise
        return promise2 = new MyPromise((resolve, reject) => {
            // 这里面依然是异步的
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
