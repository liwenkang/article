原生 ajax, jquery Ajax, axios, fetch的比对?

ajax 的常见用法?
```js
// AJAX 包括以下几个步骤。

// 1. 创建 XMLHttpRequest 实例
var xhr = new XMLHttpRequest()

// 2. 发出 HTTP 请求

// GET 请求
xhr.open('GET', '/api', true)
xhr.send(null)

// POST 请求
xhr.open('POST', '/api', true)

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send('username=admin&password=root')

    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({a: 1}))

// 3. 接收服务器传回的数据
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log(xhr.responseText)
        } else {
            console.log(xhr.statusText)
        }
    }
}

xhr.onerror = function (e) {
    console.log(xhr.statusText)
}

// 4. 更新网页数据
```
ajax 存在的问题?

fetch 解决了什么问题?

fetch 的用法?
```js
var url = '//localhost:3000/scnocs_s/getCesiumDataPost'
fetch(url, {
    method: 'post',
    headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
    }),
    credentials: 'include', // 带 cookie
    body: 'foo=1&bar=2'
}).then(response => {
    return response.json()
}).then(res => {
    console.log('res', res)
})
```

fetch 的坑?

fetch 和 axios 的区别?
fetch 在请求 json 数据的时候,在第一个 then 中要调用 text.json() 后,再在下一个 then 中拿到真正的数据
axios 在请求 json 数据的时候,第一个 then 就可以拿到数据了