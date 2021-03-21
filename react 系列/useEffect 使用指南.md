# useEffect 使用指南

在第一次使用 useEffect 的时候,你有没有这些疑问呢?

什么时候触发?

参数是什么?

应用场景?

如何使用 useEffect 请求数据呢?

与 class 中的 componentDidMount, componentDidUpdate, componentWillUnmount 相比有什么区别呢?

...



接下来让我们开始 coding 解决这些疑惑

第一个问题: 触发的时机

在 class 时期 react 的生命函数大致是这样的

挂载时: 

constructor => getDerivedStateFromProps => render => react 更新 DOM 和 refs => componentDidMount

更新时:

新 props => getDerivedStateFromProps => shouldComponentUpdate => render => getSnapshotBeforeUpdate => react 更新 DOM 和 refs => componentDidUpdate

setState => getDerivedStateFromProps => shouldComponentUpdate => render => getSnapshotBeforeUpdate => react 更新 DOM 和 refs => componentDidUpdate

forceUpdate => getDerivedStateFromProps => render => react 更新 DOM 和 refs => componentDidUpdate

卸载时:

componentWillUnmount

而 useEffect 

```

```





