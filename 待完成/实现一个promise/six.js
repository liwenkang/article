function MyPromise(executor) {
    var self = this
    self.status = 'pending'
    self.onResolvedCallbacks = []
    self.onRejectedCallbacks = []

    function resolve(value) {
        // 异步的
        if (value instanceof MyPromise) {
            // 无需往下执行
            return value.then(resolve, reject)
        }

        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'resolved'
                self.data = value

                for (var i = 0; i < self.onResolvedCallbacks.length; i++) {
                    self.onResolvedCallbacks[i](value)
                }
            }
        })
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason

                for (var i = 0; i < self.onRejectedCallbacks.length; i++) {
                    self.onRejectedCallbacks[i](reason)
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
        reject(new TypeError('出错了'))
    }

    var called = false

    if (x instanceof MyPromise) {
        if (x.status === 'pending') {
            x.then(v => {
                return RESOLVE_PROMISE(promise2, v, resolve, reject)
            }, reject)
        } else {
            return x.then(resolve, reject)
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
                return reject(e)
            }
        }
    } else {
        resolve(x)
    }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : value => {
        return value
    }
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    }

    var self = this
    var promise2

    if (self.status === 'pending') {
        return promise2 = new MyPromise((resolve, reject) => {
            self.onResolvedCallbacks.push(value => {
                try {
                    var x = onResolved(value)
                    return RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallbacks.push(reason => {
                try {
                    var x = onRejected(reason)
                    return RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    if (self.status === 'resolved') {
        // 异步的
        return promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    var x = onResolved(self.data)
                    return RESOLVE_PROMISE(promise2, x, resolve, reject)
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
                    return RESOLVE_PROMISE(promise2, x, resolve, reject)
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
