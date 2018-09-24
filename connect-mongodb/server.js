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