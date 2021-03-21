# React 系列

在经过 [lbyo](https://v2ex.com/member/lbyo) 同学的无情安利后(名言: 你是不是被 redux PUA 了?),我才发现 react 已经改变,而我不得不重新面对陌生又熟悉的 react.

在去年给公司开发的某后台管理系统中,初生牛犊不怕虎,硬上了 typescript+react+redux+react-router+antd,由于需求都比较清晰靠谱,开发过程也比较平滑.如今回头来看,在当时的开发过程中其实忽略了很多问题,比如对于表单校验,文件结构的设计,数据的跨组件共享等都没做什么深入的探索.

本系列尝试解释一些在使用 react 时需要注意的一些细节,预计涉猎以下几个方向 react hook, mobx, ract-router, antd, typescript, react-query.

当我们双手放置在键盘,熟练输入

```
yarn create react-app my-app --template typescript
```

后,迎接我们的就是一个又一个的 ~~bug~~ feature了

暂定了以下几篇题目,每日更新.

- [x] react hook 的调用顺序
- [x] react hook 的 setInterval
- [ ] react hook 的 useEffect 指南
- [ ] mobx 的使用指南之 redux 到底哪不行了?