使用 express 起一个测试后台 server

I. 设置 CORS 跨域

```js
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};

app.use(allowCrossDomain);
```

II. 如何解析前端发送的 get/post 请求?

get 请求要解析 url
```js
// 客户端
xhr.open('GET', '//localhost:3000/scnocs_s/getStationsBy3D?a=1', true)
xhr.send(null)

// 服务端
res.send(req.query)
```

post 请求也要解析 url 还有 data 中携带的数据

两种 Content-Type 数据解析
1. Content-Type: application/x-www-form-urlencoded 原生 form 表单提交数据
```js
// 客户端
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
xhr.send('username=admin&password=root')

// 服务端
var bodyParser = require('body-parser');//body-parser中间件来解析请求体
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

res.send(req.body)
```

2. Content-Type: application/json json数据
```js
// 客户端
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.send(JSON.stringify({a: 1}))

// 服务端
var bodyParser = require('body-parser');//body-parser中间件来解析请求体
app.use(bodyParser.json());

res.send(req.body)
```
