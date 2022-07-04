# mongodb实践过程中的一些问题

1. MongoDB如果需要远程链接则需要创建认证用户

控制台通过mongod/mongosh启动mongo的终端

```shell
mongodb
或
mmongosh
```

创建用户角色用户

```javascript
db.createUser(
  {
    user: "linpingjun",
    pwd: "abc@123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
 )
```

通过角色用户登录

```shell
mongosh -u linpingjun -p abc@123 --authenticationDatabase admin
```

查看有多少用户

````shell
show users
````

2. 在本地客户端上可以通过mongo连接服务器上的mongo

````shell
mongo -u linpingjun -p abc@123 111.229.62.79/admin
````

3. 针对本地客户端连接远端，需要在服务器上修改mongo的配置文件，目录在/etc/mongo.conf
可以参考[How to connect to your remote MongoDB server](https://indianceo.medium.com/how-to-connect-to-your-remote-mongodb-server-68725a8e53f)，最主要的是修改两点，net下的bindIp调整为`0.0.0.0`。

````shell
# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0  <- update this line

# enabled一定要是字符串，测试过，如果非字符串则无法穷mongo
security:
  authorization: 'enabled'
````

最后是重启mongo

````shell
sudo service mongod restart
````
