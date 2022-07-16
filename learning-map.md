# koa 实践图谱

## 日常实践图谱

- 20220619

1. 搭建基于 koa 的 web 服务器
2. 选择 pnpm 作为包管理器
3. 选择 only-allow 进行包管理的限定，只支持 pnpm
4. 探索 koa-router 路由的使用

- 20220620

1. 实践了基于 nodemon 启动 node 程序进行监听
2. 实践了基于 ts 进行编写程序，并且基于 ts-node 进行执行 node 程序
3. 实践了基于 nodemon+ts+tsconfig.json 配置，并支持通过‘@/\*’替代路径‘./src/\*’，可以参考 package.json 和 tsconfig.json 和 nodemon.json 之间配置的联动
4. 添加 pretty 进行代码格式化，配置项目.setting.json 支持当前 workspace 的 formatOnSave

- 20220621

1. 实践了如何进行 node 程序基于 ts-node 运行时断点配置
2. 编写了爬取公众号文章逻辑
3. 编写了爬取东财首页行情的数据的逻辑

- 20220622

1. 定义了全局的异常捕获中间件，方便请求异常进行日志记录
2. 定义了全局路由请求时长的统计 log 中间件

- 20220623

1. 扩展 koa 路由的 context 类型，添加 success 和 fail 函数，对接口返回进行格式约定
2. 实践 log4j 在项目中的使用

- 20220624

1. 完善 log4j 封装，完成对全局 ErrorCatch 进行了记录
2. 完善 log4j 对接口请求耗时的记录

- 20220625

1. 实践了 node_schedule 来完成定时任务的工作
2. 通过定时任务封装获取 eastmoney 行情的数据

- 20220626-20220629

1. 学习了关于 Puppeteer 的一些 api，使用方式
2. 实践了基于 Puppeteer 进行界面数据的爬取（支持模拟点击，等待异步数据）
3. 实践了基于 Puppeteer 对韭菜公社热点异动数据的爬取

## 准备实践的图谱

- [x] 爬取韭菜公社的一些数据
- [x] 探索基于 Puppeteer 来进行数据爬取

  > [结合项目来谈谈 Puppeteer](https://zhuanlan.zhihu.com/p/76237595)

  > [Node.js 库 Puppeteer 常用 API 及骚操作总结](https://juejin.cn/post/6844903997845962759)

- [x] 探索部署基于 ts 构建的 node 程序
  > pm2 支持通过下载 typescript 去运行 ts 程序，但是极不推荐，因为这样需要在服务端做一次 ts 转 js 的过程，这是一种负担。所以本系统还是通过在部署前，打包将 ts 转为 js，然后直接部署 js 的方式去运行。pm2 的配置可以参考项目根目录的`ecosystem.config.js`配置。打包遇到的问题： 1. 是需要将代码的路径别名`@/*`等转化为真正的路径，本项目通过一个插件`tscpaths`进行转换。 2. 如何配置`ecosystem.config.js`，参考[官网配置](https://pm2.keymetrics.io/docs/usage/application-declaration/)。如何启动`pm2 start ecosystem.config.js`
- [x] 探索定时任务的最佳实践
  > [Node.js 之定时任务](https://juejin.cn/post/6856586709837512718)
- [ ] 探索任务队列的最佳实践
- [ ] 探索断点调试程序，程序修改可以自启动
- [x] 探索基于 MongoDb 将数据落库

## 遇到的问题

1. 部署在 CentOS 8 环境上，puppeteer 虽然会帮我们安装 `chromium`，但是 `chromium` 的启动不允许在 `root` 环境下需要添加`--no-sandbox`，否则无法启动。[issues-3698](https://github.com/puppeteer/puppeteer/issues/3698)
2. pnpm 需要依赖 node14 以上的版本
3. nvm 的更新极度依赖对 github 网络的通畅，通过 ip 检查工具（ip 监测网站）检查哪些 ip 可以访问 github，然后通过修改 host 的方式，可以比较快的升级 nvm
4. CentOS 安装 MongoDB 参考官网[centos 安装 MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/)
5. 远程数据库工具连接 Mongo，需要先开放防火墙端口。[mongodb.conf](https://blog.csdn.net/qq_39722119/article/details/84347222)
6. 偶遇一次开发过程中文件中文件输入"@/xx"无法进行代码模块提示。这种情况很可能是 typescript 服务已经挂了`Ctrl+Shift+P > Typescript: Restart TS Server`进行解决[In VS Code: [ts] Cannot find module '@src/xxx'](https://stackoverflow.com/questions/51319613/in-vs-code-ts-cannot-find-module-src-xxx)
