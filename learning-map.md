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

- [ ] 探索部署基于 ts 构建的 node 程序
- [x] 探索定时任务的最佳实践
  > [Node.js 之定时任务](https://juejin.cn/post/6856586709837512718)
- [ ] 探索任务队列的最佳实践
- [ ] 探索断点调试程序，程序修改可以自启动
- [ ] 探索基于 MongoDb 将数据落库
