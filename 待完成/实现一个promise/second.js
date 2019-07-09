function MyPromise(executor) {
    var self = this

    self.status = 'pending'
    self.onResolvedCallback = []
    self.onRejectedCallback = []

    function resolve(value) {
        // 异步的
        setTimeout(() => {
            // 如果 value 本身就是一个 promise ,那么应该返回这个 promise 的状态
            if (value instanceof MyPromise) {
                return value.then(resolve, reject)
            }

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

function RESOLVE_PROMISE(promise2, x, resolve, reject) {
    var then
    var called = false

    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
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

    if ((typeof x === 'function' || typeof x === 'object') && x !== null) {
        try {
            then = x.then
            if (typeof then === "function") {
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

// MyPromise.prototype.then = function (onResolved, onRejected) {
//     var self = this
//     var promise2
//     onResolved = typeof onResolved === 'function' ? onResolved : function (v) {
//         return v
//     }
//     onRejected = typeof onRejected === 'function' ? onRejected : function (r) {
//         throw r
//     }
//

// }

MyPromise.prototype.then = function (onResolved, onRejected) {
    var self = this
    var promise2
    onResolved = typeof onResolved === 'function' ? onResolved : function (v) {
        return v
    }
    onRejected = typeof onRejected === 'function' ? onRejected : function (r) {
        throw r
    }

    if (self.status === 'pending') {
        // 分别讨论
        return promise2 = new MyPromise(function (resolve, reject) {
            // 加到 callback 里面
            self.onResolvedCallback.push(function (value) {
                try {
                    var x = onResolved(value)
                    // 这里要针对 x 的不同情况分别处理
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallback.push(function (reason) {
                try {
                    var x = onRejected(reason)
                    // 这里要针对 x 的不同情况分别处理
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }


    if (self.status === 'resolved') {
        // 已经 resolved 了, 那就直接调用 onResolved, 再返回一个 promise (也就是 then 返回的是一个 promise)
        return promise2 = new MyPromise((resolve, reject) => {
            // 这里是异步的
            setTimeout(() => {
                try {
                    var x = onResolved(self.data)
                    // 这里要针对 x 的不同情况分别处理
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
                    // 这里要针对 x 的不同情况分别处理
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
