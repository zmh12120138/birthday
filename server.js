var http=require('http');
var express=require('express');
var sio=require('socket.io');
var path=require('path');
var app=express();
var server=http.createServer(app);
var redis=require('redis'); //引入redis模块
var fs = require('fs');  //引入fs模块
var settings=require('./settings.js');  //引入settings.js模块---数据库设置
var sendMail=require('./sendMail.js');  //引入自定义的sendMail模块，用来发送邮件
app.get('/',function(req,res){
    res.sendfile('./public/index.html');
});   //设置路由，当客户端请求'/'时，发送文件command.html
app.use(express.static(path.join(__dirname, 'public')));  //设置public文件夹为静态资源文件夹
server.listen(1338);
var client=redis.createClient(settings.redis.port);   //建立redis客户端并连接至redis服务器
var io=sio.listen(server);  //监听1338端口
var number=0;
io.sockets.on('connection',function(socket){
    number=number+1;
    client.get('numberTotal',function(err,response){
        if(err) throw(err);
        else{
            var nm=response*1+1;
            client.set('numberTotal',nm,function(err,response){
                client.get('numberTotal',function(err,response){
                     console.log('访问总次数：'+response);
                     socket.emit("numberTotal",response);
                });
            }) ;
        }
    });
    
    client.lrange("message",0,-1,function(err,response){
        if(err) throw(err);
        socket.emit("display",response);
    });
    
    console.log("访问次数"+number);
    socket.on('getname',function(data){
        var log="实名访问日志：    "+data.name+"于"+data.date+"访问本站,";
         client.hmset('logs', 'number', number, 'name', data.name,'date',data.date , function (err, response) {
            if (err) throw (err);
            client.lpush('number',number,function(err,response){
                if(err) throw(err);
                else{
                     var logs=log+"是第"+response+"个实名访问者\r\n";
                     console.log(logs);
                     sendMail.sendMail(logs);
                     var options={flag:'a'};
                     fs.writeFile('./logs.log',logs,options,function(err){
                         if(err) throw(err);
                         else console.log("写文件操作成功");
                     });
                }
            });
        });    
    });
    
    socket.on("submitMessage",function(data){
        sendMail.sendMail("收到新留言："+data);
        client.rpush('message',data,function(err,response){
            if(err) throw(err);
            console.log("收到消息："+data);
            client.lrange("message",0,-1,function(err,response){
                 if(err) throw(err);
                  io.sockets.emit("display",response);
            });
            socket.broadcast.emit("newMessage",data);
        });
    });
});