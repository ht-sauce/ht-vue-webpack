# vue使用webpack5搭建项目基础配置
## 使用方式
[本地阅读文档](plugin%2FREADME.md)

[github阅读](https://github.com/ht-sauce/ht-vue-webpack/blob/main/plugin/README.md)

## 相关博客
https://juejin.cn/column/7272005801081700408

## 关于该项目和VueCli，为什么要做这个项目
[VueCli](https://github.com/vuejs/vue-cli)目前处于维护模式这是一年前的事情了，一年间持续稳定在5.0.7版本，其实项目继续使用并没有很大问题，
构建慢更多的是js本身的问题和硬件问题，在我写了ht-vue-webpack后中间持续研究vueCli的代码，发现vueCli其实并没有锁webpack版本，最后发现构建慢、
主要还是eslint在运行时的问题

eslint在webpack构建和运行的时候绑定在控制台，导致每次编译都需要完整的跑一边eslint，想要快直接把eslint从运行时剔除出去就行了。

关于自身项目规范的约束可以通过husky，lint-staged在提交代码的时候进行检查，这样就不会影响到构建速度了。

vueCli的生命预计还能有2年，但是vue对于webpack生态的支持上未来主要就集中在vue-loader上了，所以我觉得还是有必要自己搭建一套基础配置的。

在当初还是个菜鸟的时候如果没有vueCli像react-create-app一样，我可能都无法构建出来一个前端项目，如今又是vueCli逼了自己一把，让我能够自己第一次的完整的构建一个
webpack的配置，这下以后就不怕webpack了。
