## vue 项目的测试

将demo配置好

```js
// Import the mount() method from the test utils
// and the component you want to test
import { mount } from '@vue/test-utils'
import Counter from './counter'

describe('Counter', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(Counter)

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('<span class="count">0</span>')
  })

  // it's also easy to check for the existence of elements
  it('has a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('button should increment the count', () => {
    expect(wrapper.vm.count).toBe(0) // wrapper.vm 是 vue 实例
    const button = wrapper.find('button')
    button.trigger('click')
    expect(wrapper.vm.count).toBe(1)
  })
})
```

测试只关心输入和输出,不关心实现的细节
在修改了部分代码之后,项目不会爆炸
通过单元测试,提炼组件的功能
单元测试,表明了组件的功能
