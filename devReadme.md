### 开发第一原则：尊重原作者，不要直接改原有的
### 开发第二原则：如果必须扩展，写在最后，不要随便乱插，如果觉得每次都要滚到最后麻烦，就自己建个文件，把需要引用进去即可
### 开发第三原则 先拉后推原则，推前必拉！(不是拉便便的拉),

###  项目简单环境需求
##### 1 谷歌浏览器请升级到最新
##### 2 nodejs  v18 以上，建议使nodejs用多版本管理器  npm  使用方法 谷歌 百度搜一些，或者参照：[https://blog.csdn.net/qq_41904629/article/details/123552090](https://blog.csdn.net/qq_41904629/article/details/123552090)
### 开发建议 ：
##### 1 类型文件件建在自己的文件夹里，使用引用方式 用原有的类型
##### 2 因为是联合开发，拉完代码有人装了包你也不知道，所有 直接使用 这个命令 `pnpm i && pnpm` dev会先装包后跑


### 页面开发：
##### 在[src/views]()创建页面文件即可，如果不想生成路由或类型的文件，请使用 modules创建文件夹，而不是 components

### mock相关：
#####  请尽量使用 https://apifox.com/ ，在 [env.config.ts](env.config.ts)，修改 `const mockURL = 'https://mock.apifox.com/m1/4080832-0-default';`
##### 并将该文件排除提交

### 类型概览：

##### 01 国际化类型:[src/typings/app.d.ts]()   type（App.I18n.Schema）
##### 02 接口类型:[src/typings/api.d.ts]()
##### 03 路由类型:[src/typings/elegant-router.d.ts]()
##### 04 RouteMeta类型:[src/typings/elegant-router.d.ts]()
##### 05 全局类型:[src/typings/elegant-router.d.ts]()
##### 06 数据仓库类型:[src/typings/storage.d.ts]()
##### 99 其他应该是迁移而来，用到自行分析

基本不用动 的类型
##### 07 组件类型:[src/typings/components.d.ts]()  不要动，只要在views里 基本都是自己生成的
##### 08 naive-ui类型:[src/typings/naive-ui.d.ts]()

基本不会用的类型
##### 09  package类型:[src/typings/naive-ui.d.ts]()  作者有个 package 二次封装了一些库的功能，跟这个有关，不明白就不动即可
##### 10 环境类型:[src/typings/env.d.ts]()  尽量不动 ，估计业务层开发也用不上
##### 11 联合密钥:[src/typings/union-key.d.ts]() 作者用的一些类型吧，应该用不上

### 其他：请采用问答的形式进行，在这里直接提问，任何人知道的话都可直接回答，如果嫌麻烦要在群里问，请您把本次问答的内容补充在这里，做一名高素质的开发人员

### Q&A：
##### 1 Q:最近开心吗？
##### 1 A:还好，挺开心的







##### end
