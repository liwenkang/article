# 开闭原则、函数式编程和消息机制

SOLID 五大原则：

Single Responsibility Principle 单一责任原则
The Open Closed Principle 开放封闭原则
The Liskov Substitution Principle 里氏替换原则
The Dependency Inversion Principle 依赖倒置原则
The Interface Segregation Principle 接口分离原则

The Open Closed Principle 开放封闭原则: 软件系统应当对扩展开放，对修改封闭（感觉像没说）。
软件系统的核心逻辑都不应该轻易改变，否则会破坏系统的稳定性和增加测试成本。我们应当建立合适的抽象并统一接口，当业务需要扩展时，我们可以通过增加实体类来完成。
核心就是将通用的部分封装,将需要订制的部分抛出

函数式编程:
函数为“一等公民”
模块化、组合
引用透明避免状态改变
避免共享状态

React 其实是应用数据对UI的一种映射，不同的数据会映射出不同样式的 UI 界面，我们可以得出如下的表达式：
$UI = React(data)$
没错，React 的本质其实是一种函数，并且还是符合 FP 要求的“引用透明”函数。所谓“引用透明”就是指函数的输出仅依赖函数参数，不受任何外部环境影响。这样的函数可测试性强，也非常容易进行组合。

消息机制
使用消息机制最大的好处在于可以做到业务模块间安全解耦，模块间通过发送消息的方式进行协作
在这种模式下，模块完全不知道其它模块的存在，彻底做到了解耦。
