直接使用原生 ajax 请求数据时,遇到的问题:
Access to XMLHttpRequest at 'http://192.168.0.176:8083/scnocs_s/getStationsBy3D' from origin 'http://localhost:8080' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

问题描述: 
    由于是 get 方法,直接使用 url 访问的时候,可以获取数据,postman 同样可以拿到
    在页面中使用原生 ajax 时,请求没有进入 success 和 error 的处理,在控制台 network 可以看到数据正确返回了

解决方案:
    在后端设置 "Access-Control-Allow-Origin","*"
