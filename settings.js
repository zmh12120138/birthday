exports.mysql={
    host:'ensaving.mysql.rds.aliyuncs.com',
    port:3306,
    database:'ioserver_test',
    user:'minghui',
    password:'MHZhao123'
};

exports.redis={
    port:'6379',
    host:'localhost',
    options:{connect_timeout:1}
};

exports.mailOptions={
    service:'QQ',
    auth_user:'1805377859@qq.com',
    auth_pass:'xhmwan1314',

    from:'node 服务器 <1805377859@qq.com>',  //'<>'中的地址应该与auth_user中的地址一致!
    to:'503035535@qq.com',
    subject:'生日相关'
};