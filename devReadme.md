### 开发第一原则：尊重原作者，不要直接改原有的
### 开发第二原则：如果必须扩展，写在最后，不要随便乱插，如果觉得每次都要滚到最后麻烦，就自己建个文件，把需要引用进去即可

### 页面开发：
##### 在[src/views]()创建页面文件即可，如果不想生成路由或类型的文件，请使用 modules创建文件夹，而不是 components


### 类型概览：
#### 开发建议 ，类型文件件建在自己的文件夹里，使用引用方式 用原有的类型
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
