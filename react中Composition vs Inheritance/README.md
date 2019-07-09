## Composition vs Inheritance 

[官方文档](https://reactjs.org/docs/composition-vs-inheritance.html)

当前我有一个表格,它可能需要左边加上一个标题栏,可能需要编辑功能,也可能就是单纯的表格

可以使用继承,也可以写一个通用的组件,然后再写一个定制化的组件(直接使用通用组件 + 相关配置, 通过向通用组件传递 props 实现)

什么时候应该使用继承?(never......)

我们可以写一个功能贼多的通用表格,然后其他人都通过 props 去设定不同的

注意到如果一个组件内部写了子组件,那在父组件上是可以拿到子组件的所有children,通过 this.props.children(如果没有子组件,那么 children 是可以自定义的,如果有子组件,那么自定义的 children 才会生效)



