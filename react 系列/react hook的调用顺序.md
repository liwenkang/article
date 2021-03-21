# react hook 的调用顺序

Hook 的调用顺序非常重要,保证了 React 在多次 useState(得到独立的本地 state) 和 useEffect 调用之间保持 hook 状态的正确,所以 hook 的调用必须在最顶层.

可以参考 [React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)

相当于两个数组 state 和 setters ,有一个指针 cursor 来指示位置,setter 触发的时候,就回去修改 state 数组中对应的值

而这个对应关系就是依靠 调用顺序保证的!

