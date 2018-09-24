# Node.js 大战 MongoDB

如何使用 Node.js 连接 Mongodb ？

## 经济基础：

    Node.js

    Yarn

    mongodb(将 MongoDB 文件夹添加到了环境变量中)

    PS(Windows Powershell,文中所有的 > 均表示在PS中输入)

    Robo 3T(用于数据库的直观显示，非必需)


## 熟悉一下 MongoDB 咋玩

0. 在桌面新建文件夹 connect-mongodb，其路径为 "C:\Users\li_wenkang\Desktop\connect-mongodb"

1. yarn init 添加 package.json 文件

2. 使用 Yarn 添加依赖，
```
> yarn add mongodb
```

结果如下：
```
{
  "name": "connect-mongodb",
  "version": "1.0.0",
  "main": "index.js",
  "author": "liwenkang",
  "license": "MIT",
  "dependencies": {
    "mongodb": "^3.0.0-rc0"
  }
}
```
3. 运行 MongoDB 服务器

方法一：
在根目录路径下
```
> mongod --dbpath "C:\Users\li_wenkang\Desktop\connect-mongodb\data"
```
看到最后一行有提示 
```
waiting for connections on port 27017 
```
即可

方法二：
配置 MongoDB 服务
在根目录路径下
```
> mkdir C:\Users\li_wenkang\Desktop\connect-mongodb\data\db
> mkdir C:\Users\li_wenkang\Desktop\connect-mongodb\data\log
```
创建一个配置文件 mongod.cfg 位于 C:\Users\li_wenkang\Desktop\connect-mongodb，其中指定 systemLog.path 和 storage.dbPath。
具体配置内容如下：

```
systemLog:
    destination: file
    path: C:\Users\li_wenkang\Desktop\connect-mongodb\data\log\mongod.log
storage:
    dbPath: C:\Users\li_wenkang\Desktop\connect-mongodb\data\db
```
接下来的操作请使用管理员PS

安装 MongoDB服务
```
> mongod --config "C:\Users\li_wenkang\Desktop\connect-mongodb\mongod.cfg" --install
```
接下来就可以很方便的启动和关闭服务了
启动 MongoDB 服务
```
> net start MongoDB
```
关闭 MongoDB 服务
```
> net stop MongoDB
```
移除 MongoDB 服务
```
> mongod --remove
```
4.连接MongoDB

另开一个PS
```
> mongo
// 连接完成
// 此时你就可以加一些数据做做试验了
> db.runoob.insert({x:10})
WriteResult({ "nInserted" : 1 })
> db.runoob.find()
{ "_id" : ObjectId("5604ff74a274a611b0c990aa"), "x" : 10 }
```
注意：

1). 只要你开着 MongoDB 服务，就能在 Robo 3T 里查看，编辑数据。

2). ctrl+c 断开连接，但此时 MongoDB 服务仍处于启动状态。

## Node.js 和 MongoDB 的连接

### 小试牛刀

1. 在创建数据库的第一步就遇到了坑

server.js文件如下所示：
```
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mydb";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("数据库已创建!");
    db.close();
})
```
```
> C:\Users\li_wenkang\Desktop\connect-mongodb> node server.js
```
报错信息如下：
```
C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb\lib\mongo_client.js:785
          throw err;
          ^
MongoNetworkError: failed to connect to server [127.0.0.1:27017] on first connect [MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017]
    at Pool.<anonymous> (C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb-core\lib\topologies\server.js:493:11)
    at Pool.emit (events.js:159:13)
    at Connection.<anonymous> (C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb-core\lib\connection\pool.js:327:12)
    at Object.onceWrapper (events.js:254:19)
    at Connection.emit (events.js:159:13)
    at Socket.<anonymous> (C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb-core\lib\connection\connection.js:245:50)
    at Object.onceWrapper (events.js:254:19)
    at Socket.emit (events.js:159:13)
    at emitErrorNT (internal/streams/destroy.js:64:8)
    at _combinedTickCallback (internal/process/next_tick.js:138:11)
```
拿出必杀技：面向搜索引擎编程！
[can't-start-mongodb-on-localhost-for-node-js](https://stackoverflow.com/questions/47853807/cant-start-mongodb-on-localhost-for-node-js)

哦，原来是需要先启动 MongoDB 服务
```
> C:\Users\li_wenkang\Desktop\connect-mongodb> net start mongoDB

MongoDB 服务正在启动 ..
MongoDB 服务已经启动成功。
> C:\Users\li_wenkang\Desktop\connect-mongodb> node server.js
数据库已创建!
```
美滋滋，继续挖坑

2. 创建集合(Collection)，没错，又报错了。

server.js文件如下所示：
```
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.createCollection("runoob", function (err, res) {
        if (err) throw err;
        console.log("创建集合!");
        db.close();
    });
});
```
```
> C:\Users\li_wenkang\Desktop\connect-mongodb> node server.js
```
报错信息如下所示：

```
C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb\lib\mongo_client.js:797
          throw err;
          ^

TypeError: db.createCollection is not a function
    at C:\Users\li_wenkang\Desktop\connect-mongodb\server.js:6:8
    at args.push (C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb\lib\utils.js:431:72)
    at C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb\lib\mongo_client.js:254:5
    at connectCallback (C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb\lib\mongo_client.js:933:5)
    at C:\Users\li_wenkang\Desktop\connect-mongodb\node_modules\mongodb\lib\mongo_client.js:794:11
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
```

面向搜索引擎编程ing...
[db-createcollection-is-not-a-function](https://stackoverflow.com/questions/47658775/db-createcollection-is-not-a-function)

修改server.js文件如下所示：
```
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbase = db.db("mydb"); // change here
    dbase.createCollection("customers", function(err, res) {
        if (err) throw err;
        console.log("集合创建成功!");
        db.close();
    });
});
```
### 正式开始数据库操作(CURD)

1. 以下实例我们连接数据库 runoob 的 site 表，并插入两条数据：

server.js文件如下所示：
```
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017';

MongoClient.connect(DB_CONN_STR, function (err, db) {
    console.log("连接成功！");
    insertData(db, function (result) {
        console.log(result);
        db.close();
    });
});

var insertData = function (db, callback) {
    //连接到表 site
    var dataBase = db.db("runoob"); //here
    var collection = dataBase.collection('site');
    var data = [{"name": "liwenkang", "age": "21"},{"name": "gua", "age": "20"}];
    //插入数据
    collection.insert(data, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}
```
运行后看起来一切正常，实际上暗潮涌，先看下面这段：
```
collection.insert(data, function (err, result) {
    if (err) {
        console.log('Error:' + err);
        return;
    }
    callback(result);
});
```
首先是 WebStorm 说 insert 这个已经过时了，需要换一个？？？

其次就是异步和回调的问题？？？这得是多大的坑？？？

此外，如果你执行一次 server.js 后，再在 server.js 中修改插入的数据，重复执行，会发现它只重复插入第一次的内容

这三个问题我都没解决，需要加个 todo。

跑个题......

当 Python 党用着 jinja 时，我们难道就不要看看 Ejs ，难道就不要看看 jade ，难道就不要看看 Nunjucks ？搞不好又开始撕逼了...

睡觉睡觉

2017年12月24日 14:54:54

继续挖坑

2. 前文我们完成了一个有问题的数据插入，接下来是数据的查询操作：

server.js文件如下所示：

```
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017';

var selectData = function (db, callback) {
    //连接到表
  var dataBase = db.db("runoob"); //here
  var collection = dataBase.collection('site');
    //查询数据
  var whereStr = {"name": 'gua'}; // 在这里限定查找条件
    collection.find(whereStr).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

MongoClient.connect(DB_CONN_STR, function (err, db) {
    console.log("连接成功！");
    selectData(db, function (result) {
        console.log(result);
        db.close();
    });
});
```
运行后输出：
```
连接成功！
[ { _id: 5a3e78921a6f8b28d8e13e79, name: 'gua', url: '21' } ]
```
3. 更新数据

server.js文件如下所示：
```
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017';

var updateData = function (db, callback) {
    //连接到表
  var dataBase = db.db("runoob"); //here
  var collection = dataBase.collection('site');
    //更新数据
  var whereStr = {"name": 'gua'}; // 查到改哪里
    var updateStr = {$set: {"url": "https://www.gua.com"}}; // 改为什么值
    collection.update(whereStr, updateStr, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

MongoClient.connect(DB_CONN_STR, function (err, db) {
    console.log("连接成功！");
    updateData(db, function (result) {
        console.log(result);
        db.close();
    });
});
```
运行后数据成功修改，输出为：
```
连接成功！
CommandResult {
  result: { n: 1, nModified: 1, ok: 1 },
  connection: 
   Connection {
     domain: null,
     _events: 
      { error: [Function],
        close: [Function],
        timeout: [Function],
        parseError: [Function] },
     _eventsCount: 4,
     _maxListeners: undefined,
     options: 
      { host: 'localhost',
        port: 27017,
        size: 5,
        minSize: 0,
        connectionTimeout: 30000,
        socketTimeout: 360000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        noDelay: true,
        ssl: false,
        checkServerIdentity: true,
        ca: null,
        crl: null,
        cert: null,
        key: null,
        passPhrase: null,
        rejectUnauthorized: false,
        promoteLongs: true,
        promoteValues: true,
        promoteBuffers: false,
        reconnect: true,
        reconnectInterval: 1000,
        reconnectTries: 30,
        domainsEnabled: false,
        disconnectHandler: [Store],
        cursorFactory: [Function],
        emitError: true,
        socketOptions: {},
        promiseLibrary: [Function: Promise],
        clientInfo: [Object],
        bson: BSON {} },
     id: 0,
     logger: Logger { className: 'Connection' },
     bson: BSON {},
     tag: undefined,
     messageHandler: [Function],
     maxBsonMessageSize: 67108864,
     port: 27017,
     host: 'localhost',
     family: undefined,
     keepAlive: true,
     keepAliveInitialDelay: 300000,
     noDelay: true,
     connectionTimeout: 30000,
     socketTimeout: 360000,
     destroyed: false,
     domainSocket: false,
     singleBufferSerializtion: true,
     serializationFunction: 'toBinUnified',
     ca: null,
     crl: null,
     cert: null,
     key: null,
     passphrase: null,
     ciphers: null,
     ecdhCurve: null,
     ssl: false,
     rejectUnauthorized: false,
     checkServerIdentity: true,
     responseOptions: 
      { promoteLongs: true,
        promoteValues: true,
        promoteBuffers: false },
     flushing: false,
     queue: [],
     connection: 
      Socket {
        connecting: false,
        _hadError: false,
        _handle: [TCP],
        _parent: null,
        _host: 'localhost',
        _readableState: [ReadableState],
        readable: true,
        domain: null,
        _events: [Object],
        _eventsCount: 7,
        _maxListeners: undefined,
        _writableState: [WritableState],
        writable: true,
        allowHalfOpen: false,
        _bytesDispatched: 506,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: null,
        _server: null,
        _idleTimeout: 360000,
        _idleNext: [TimersList],
        _idlePrev: [TimersList],
        _idleStart: 1088,
        _destroyed: false,
        read: [Function],
        _consuming: true,
        [Symbol(asyncId)]: 5,
        [Symbol(bytesRead)]: 0,
        [Symbol(asyncId)]: 8,
        [Symbol(triggerAsyncId)]: 1 },
     writeStream: null,
     hashedName: '29bafad3b32b11dc7ce934204952515ea5984b3c',
     workItems: [],
     buffer: null,
     sizeOfMessage: 0,
     bytesRead: 0,
     stubBuffer: null },
  message: 
   Response {
     parsed: true,
     raw: <Buffer 4b 00 00 00 60 00 00 00 02 00 00 00 01 00 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 27 00 00 00 10 6e 00 01 00 00 00 10 6e 4d ... >,
     data: <Buffer 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 27 00 00 00 10 6e 00 01 00 00 00 10 6e 4d 6f 64 69 66 69 65 64 00 01 00 00 00 01 6f 6b 00 ... >,
     bson: BSON {},
     opts: 
      { promoteLongs: true,
        promoteValues: true,
        promoteBuffers: false },
     length: 75,
     requestId: 96,
     responseTo: 2,
     opCode: 1,
     fromCompressed: undefined,
     responseFlags: 8,
     cursorId: Long { _bsontype: 'Long', low_: 0, high_: 0 },
     startingFrom: 0,
     numberReturned: 1,
     documents: [ [Object] ],
     cursorNotFound: false,
     queryFailure: false,
     shardConfigStale: false,
     awaitCapable: true,
     promoteLongs: true,
     promoteValues: true,
     promoteBuffers: false,
     index: 59,
     hashedName: '29bafad3b32b11dc7ce934204952515ea5984b3c' 
	} 
}
```
4. 删除数据

修改server.js文件如下所示：

```
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017';

var delData = function (db, callback) {
    //连接到表
  var dataBase = db.db("runoob"); //here
  var collection = dataBase.collection('site');
    //删除数据
  var whereStr = {"name": 'gua'};
    collection.remove(whereStr, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
}

MongoClient.connect(DB_CONN_STR, function (err, db) {
    console.log("连接成功！");
    delData(db, function (result) {
        console.log(result);
        db.close();
    });
});
```
数据删除成功，输出为：
```
连接成功！
CommandResult {
  result: { n: 1, ok: 1 },
  connection:
   Connection {
     domain: null,
     _events:
      { error: [Function],
        close: [Function],
        timeout: [Function],
        parseError: [Function] },
     _eventsCount: 4,
     _maxListeners: undefined,
     options:
      { host: 'localhost',
        port: 27017,
        size: 5,
        minSize: 0,
        connectionTimeout: 30000,
        socketTimeout: 360000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        noDelay: true,
        ssl: false,
        checkServerIdentity: true,
        ca: null,
        crl: null,
        cert: null,
        key: null,
        passPhrase: null,
        rejectUnauthorized: false,
        promoteLongs: true,
        promoteValues: true,
        promoteBuffers: false,
        reconnect: true,
        reconnectInterval: 1000,
        reconnectTries: 30,
        domainsEnabled: false,
        disconnectHandler: [Store],
        cursorFactory: [Function],
        emitError: true,
        socketOptions: {},
        promiseLibrary: [Function: Promise],
        clientInfo: [Object],
        bson: BSON {} },
     id: 0,
     logger: Logger { className: 'Connection' },
     bson: BSON {},
     tag: undefined,
     messageHandler: [Function],
     maxBsonMessageSize: 67108864,
     port: 27017,
     host: 'localhost',
     family: undefined,
     keepAlive: true,
     keepAliveInitialDelay: 300000,
     noDelay: true,
     connectionTimeout: 30000,
     socketTimeout: 360000,
     destroyed: false,
     domainSocket: false,
     singleBufferSerializtion: true,
     serializationFunction: 'toBinUnified',
     ca: null,
     crl: null,
     cert: null,
     key: null,
     passphrase: null,
     ciphers: null,
     ecdhCurve: null,
     ssl: false,
     rejectUnauthorized: false,
     checkServerIdentity: true,
     responseOptions:
      { promoteLongs: true,
        promoteValues: true,
        promoteBuffers: false },
     flushing: false,
     queue: [],
     connection:
      Socket {
        connecting: false,
        _hadError: false,
        _handle: [TCP],
        _parent: null,
        _host: 'localhost',
        _readableState: [ReadableState],
        readable: true,
        domain: null,
        _events: [Object],
        _eventsCount: 7,
        _maxListeners: undefined,
        _writableState: [WritableState],
        writable: true,
        allowHalfOpen: false,
        _bytesDispatched: 416,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: null,
        _server: null,
        _idleTimeout: 360000,
        _idleNext: [TimersList],
        _idlePrev: [TimersList],
        _idleStart: 1014,
        _destroyed: false,
        read: [Function],
        _consuming: true,
        [Symbol(asyncId)]: 6,
        [Symbol(bytesRead)]: 0,
        [Symbol(asyncId)]: 9,
        [Symbol(triggerAsyncId)]: 1 },
     writeStream: null,
     hashedName: '29bafad3b32b11dc7ce934204952515ea5984b3c',
     workItems: [],
     buffer: null,
     sizeOfMessage: 0,
     bytesRead: 0,
     stubBuffer: null },
  message:
   Response {
     parsed: true,
     raw: <Buffer 3c 00 00 00 85 00 00 00 02 00 00 00 01 00 00 00 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 18 00 00 00 10 6e 00 01 00 00 00 01 6f 6b ... >,
     data: <Buffer 08 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 18 00 00 00 10 6e 00 01 00 00 00 01 6f 6b 00 00 00 00 00 00 00 f0 3f 00>,
     bson: BSON {},
     opts:
      { promoteLongs: true,
        promoteValues: true,
        promoteBuffers: false },
     length: 60,
     requestId: 133,
     responseTo: 2,
     opCode: 1,
     fromCompressed: undefined,
     responseFlags: 8,
     cursorId: Long { _bsontype: 'Long', low_: 0, high_: 0 },
     startingFrom: 0,
     numberReturned: 1,
     documents: [ [Object] ],
     cursorNotFound: false,
     queryFailure: false,
     shardConfigStale: false,
     awaitCapable: true,
     promoteLongs: true,
     promoteValues: true,
     promoteBuffers: false,
     index: 44,
     hashedName: '29bafad3b32b11dc7ce934204952515ea5984b3c' 
	} 
}
```
至此，使用 Node.js 对 MongoDB 的增删查改全部完成，剩下的就需要根据具体的需求去查操作语法了，感谢菜鸟教程(至今不明白按照它的代码写为啥就会出错...可能是我太菜？)，感谢 stackoverflow 上面的大神们解决了我大部分的问题。

接下来就是整理一下常见的增删查改命令了，对了还有前面遇到的三个问题。

在实际生产环境下，通常会使用 Mongoose 此类对象模型工具，更好的简化操作，下一步也要了解下这个。

附：
[Node.js 菜鸟教程](http://www.runoob.com/nodejs/nodejs-mongodb.html)
[Porschev钟慰的 Node.js学习笔记](http://www.cnblogs.com/zhongweiv/p/mongoose.html)
