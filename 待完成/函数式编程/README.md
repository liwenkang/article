函数式编程

函数不会产生副作用(对全局变量没有影响, 在任何情况下相同的输入得到相同的输出)

命令式编程/函数式编程

函数是可以作为参数传递的(而且会携带一些信息)

slice就是纯函数/splice就不是纯函数(也就是slice不会修改原数组, splice会修改)

纯函数的输出结果不依赖于系统状态(比如函数外部的全局变量)

解决方案就是使用 object.freeze() 或者 设置它的 set 失效

纯函数的优点:

可缓存
```js
function memorize(f) {
    let cache = {}

    return function () {
        var arguments_str = JSON.stringify(arguments)
        cache[arguments_str] = cache[arguments_str] || f.apply(f, arguments)
        return cache[arguments_str]
    }
}

function plus (x, y) {
    return x + y
}

function memorizePlus = memorize(plus)

memorizePlus(4)
memorizePlus(4)
```
