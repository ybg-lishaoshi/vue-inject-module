# 目标

让Vue像后台模块一样能通过插件方式添加功能。参考：

* [贡献式编程](https://blog.csdn.net/kmtong/article/details/39022525)


# 设计思路

[Vue启动钩子](https://cn.vuejs.org/v2/guide/instance.html#%E5%AE%9E%E4%BE%8B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)
提供了很好的切入点。

我们需要一个插件注册和使用过程，当中涉及到：

1. 插件命名定位坐标
2. 插件依赖关系描述
3. 插件加载过程
4. 扩展点定义
5. 扩展实现


能影响Vue行为的，可以有以下方面：

1. 全局的Vue.use(plugin): 使用 vue 插件， [插件开发文档](https://cn.vuejs.org/v2/guide/plugins.html)
2. Vue.components: 
   1. [注册静态组件](https://cn.vuejs.org/v2/guide/components-registration.html)
   2. [注册动态组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html)
3. 注册路由



