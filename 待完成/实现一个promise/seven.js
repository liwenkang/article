function MyPromise(executor) {
    var self = this
    self.status = 'pending'

    self.onResolvedCallbacks = []
    self.onRejectedCallbacks = []

    function resolve(value) {
        // 异步执行
        if (value instanceof MyPromise) {
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

MyPromise.prototype.then = function (onResolved, onRejected) {
    var self = this
    var promise2

    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    }

    // 三类
    if (self.status === 'pending') {
        return promise2 = new MyPromise((resolve, reject) => {
            self.onResolvedCallbacks.push(value => {
                try {
                    var x = onResolved(value)
                    RESOLVE_PROMISE(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })

            self.onRejectedCallbacks.push(reason => {
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
        return promise2 = new MyPromise((resolve, reject) => {
            // 异步
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
                    RESOLVE_PROMISE(x, promise2, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    return promise2
}

function RESOLVE_PROMISE(promise2, x, resolve, reject) {
    if (x === promise2) {
        reject(new TypeError('错误'))
    }

    var then
    var called = false

    if (x instanceof MyPromise) {
        if (x.status === 'pending') {
            x.then(value => {
                return RESOLVE_PROMISE(promise2, value, resolve, reject)
            }, reject)
        } else {
            return x.then(resolve, reject)
        }
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            then = x.then
            if (typeof then === 'function') {

            } else {
                resolve(x)
            }
        } catch (e) {

        }
    } else {
        resolve(x)
    }
}
