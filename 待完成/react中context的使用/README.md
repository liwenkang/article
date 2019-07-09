## react context

一脸懵逼

用到了 [context](https://reactjs.org/docs/context.html) , 目的是为了让一些近似全局的数据不再需要通过 props 一层一层的传递(父元素到子元素)

复杂程度：props < 使用组件组合 < context

Api解析

```
const MyContext = React.createContext(defaultValue);
这里的defaultValue既可以是字符串,也可以是一个对象

Class.contextType
```

contextType 

