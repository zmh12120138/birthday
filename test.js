var redis=require('redis');
var settings=require('./settings.js');  //引入settings.js模块---数据库设置
var client=redis.createClient(settings.redis.port);   //建立redis客户端并连接至redis服务器
client.lrange('message',0,-1,function(err,response){
	console.log(response[2]);
})