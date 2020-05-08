# Markdown Note

![category](https://github.com/diandianzd/git-resource/blob/master/note/category.png?raw=true)
![aritcle](https://github.com/diandianzd/git-resource/blob/master/note/article.png?raw=true)

## 快速开始

**获取源码**

``` shell
git clone https://github.com/diandianzd/markdown-note
```

**api server**  `nodejs-server`

1. 重命名 nodejs-server/config 目录下文件 index.example.js 为 index.js，修改mysql连接
2. 运行 nodejs-server/database 中的sql语句
3. 启动nodejs服务

``` shell
cd nodejs-server
npm install
npm start
```

**webpage**  `react-client`
修改 react-client/config/proxy.ts 接口地址

``` shell
cd react-client
npm install
npm start
```