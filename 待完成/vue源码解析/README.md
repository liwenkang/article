2018年12月10日 22:37:10
vue 源码学习

目录设计
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码

compiler 目录包含 Vue.js 所有编译相关的代码。它包括把模板解析成 ast 语法树，ast 语法树优化，代码生成等功能。
编译的工作可以在构建时做（借助 webpack、vue-loader 等辅助插件）；也可以在运行时做，使用包含构建功能的 Vue.js。显然，编译是一项耗性能的工作，所以更推荐前者——离线编译。

core 目录包含了 Vue.js 的核心代码，包括内置组件、全局 API 封装，Vue 实例化、观察者、虚拟 DOM、工具函数等等。
这里的代码可谓是 Vue.js 的灵魂，也是我们之后需要重点分析的地方。

platforms
Vue.js 是一个跨平台的 MVVM 框架，它可以跑在 web 上，也可以配合 weex 跑在 native 客户端上。platform 是 Vue.js 的入口，2 个目录代表 2 个主要入口，分别打包成运行在 web 上和 weex 上的 Vue.js。

server
Vue.js 2.0 支持了服务端渲染，所有服务端渲染相关的逻辑都在这个目录下。注意：这部分代码是跑在服务端的 Node.js，不要和跑在浏览器端的 Vue.js 混为一谈。
服务端渲染主要的工作是把组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序。

sfc
通常我们开发 Vue.js 都会借助 webpack 构建， 然后通过 .vue 单文件来编写组件。
这个目录下的代码逻辑会把 .vue 文件内容解析成一个 JavaScript 的对象

shared
Vue.js 会定义一些工具方法，这里定义的工具方法都是会被浏览器端的 Vue.js 和服务端的 Vue.js 所共享的。

Runtime Only VS Runtime + Compiler

我们在使用 Runtime Only 版本的 Vue.js 的时候，通常需要借助如 webpack 的 vue-loader 工具把 .vue 文件编译成 JavaScript，因为是在编译阶段做的，所以它只包含运行时的 Vue.js 代码，因此代码体积也会更轻量。

我们如果没有对代码做预编译，但又使用了 Vue 的 template 属性并传入一个字符串，则需要在客户端编译模板，如下所示：
```js
// 需要编译器的版本
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 这种情况不需要
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```
通常我们更推荐使用 Runtime-Only 的 Vue.js

当我们的代码执行 import Vue from 'vue' 的时候，就是从这个入口执行代码来初始化 Vue
真正初始化 vue 的地方:
C:\vue\src\core\index.js

先来看其中的第一部分:
C:\vue\src\core\instance\index.js
```js
// vue 实际上就是一个用 Function 实现的类，我们只能通过 new Vue 去实例化它。
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    // 如果不是生产环境而且不是用 new Vue() 实例化的话,就要提醒
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 这里的 xxxMixin 就是给 Vue 的 prototype 上扩展一些方法
// 这里没有用 class 实现, 原因就是拓展的问题
// Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```

然后是第二部分 initGlobalAPI, 定义了全局的一些方法 extend, mixin 之类

数据驱动: 目标是弄清楚模板和数据如何渲染成最终的 DOM。
![new Vue 发生了声明](new-vue.png)

用 vue-cli3 初始化项目后 
```js
// src\App.vue.js
<template>
  <div id="app">
    {{ message }}
  </div>
</template>

<style lang="scss">
</style>
```

```js
// src\main.js
import Vue from 'vue';

// eslint-disable-next-line
var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'hello vue',
    };
  },
  render(createElement) {
    return createElement('div', {
      attrs: {
        id: app,
      },
    }, this.message);
  },
});
```

```json
// runtimeCompiler
// 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
// 可能需要修改 package.json 这里
  "vue": {
    "runtimeCompiler": true
  }
```

此时在源码的 return function patch() 函数中打断点,可以看到
```js
// 这里是 patch 的源码
// oldVnode 就是 div#app 真实dom
// vnode 就是 VNode 虚拟dom
// hydrating 是 undefined
// removeOnly 是 false
return function patch (oldVnode, vnode, hydrating, removeOnly) {
    debugger
    if (isUndef(vnode)) {
      // 这里没进去
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      // 这里没进去
      // empty mount (likely as component), create new root element
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue)
    } else {
      // ====>
      // 传入的 oldVnode 实际上是一个 DOM container，所以 isRealElement 为 true，
      const isRealElement = isDef(oldVnode.nodeType) // 这里是 true
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // 这里没进去
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        // ====>
        if (isRealElement) {
          // ====>
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            // 这里没进去
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            // 这里没进去
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          // 将 oldVnode(真实 DOM) 转换为 VNode 对象(虚拟 DOM)
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        // oldElm 就是 div#app (真实dom)
        // parentElm 是 oldElm 的父元素，在我们的例子是 id 为 #app div 的父元素，也就是 Body；
        // 实际上整个过程就是递归创建了一个完整的 DOM 树并插入到 Body 上。
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        // vnode 挂载到真实的 dom 上
        // 进入 createElm
        createElm(
          vnode, // 此时是有 hello vue 的虚拟 dom
          insertedVnodeQueue, // 空的
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,  // 传入父节点 body
          nodeOps.nextSibling(oldElm) // 取到 div#app 的下一个兄弟节点, 这边拿到的是 换行...
        )
```

```js
        
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // 没进入这里
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  // nested 是 undefined
  // vnode.isRootInsert 就是 true 了
  vnode.isRootInsert = !nested // for transition enter check
  // createComponent 尝试创建子组件,失败...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data // attrs: {id: undefined}
  const children = vnode.children // VNode 里面放置 hello vue
  const tag = vnode.tag // div
  // 判断 vnode 是否包含 tag?
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        creatingElmInVPre++
      }
      // 非生产环境下对 tag 的合法性做检查
      if (isUnknownElement(vnode, creatingElmInVPre)) {
        // 没进入这里
        warn(
          'Unknown custom element: <' + tag + '> - did you ' +
          'register the component correctly? For recursive components, ' +
          'make sure to provide the "name" option.',
          vnode.context
        )
      }
    }

    // 调用平台 DOM 创建一个占位符元素 这里创建了一个真实的 div 给 vnode.elm
    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // in Weex, the default insertion order is parent-first.
      // List items can be optimized to use children-first insertion
      // with append="tree".
      const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
      if (!appendAsTree) {
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }
      createChildren(vnode, children, insertedVnodeQueue)
      if (appendAsTree) {
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }
    } else {
      // 调用 createChildren 创建子元素
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        // 执行所有的 create 的钩子并把 vnode push 到 insertedVnodeQueue 中。
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      // 把 dom 插入父节点, 因为是递归调用，子元素会优先调用 insert，所以整个 vnode 树节点的插入顺序是先子后父
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    // 没有 tag ,可能是注释
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    // 没有 tag ,可能是纯文本节点
    // 直接插入到父元素
    // return document.createTextNode(text)
    // 在我们这个例子中，最内层就是一个文本 vnode，它的 text 值取的就是之前的 this.message 的值 Hello Vue!。
    // var app = new Vue({
    //   el: '#app',
    //   render: function (createElement) {
    //     return createElement('div', {
    //       attrs: {
    //         id: 'app'
    //       },
    //     }, this.message)
    //   },
    //   data: {
    //     message: 'Hello Vue!'
    //   }
    // })
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
```

```js
        // 续前面
        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          // 没进去
          let ancestor = vnode.parent
          const patchable = isPatchable(vnode)
          while (ancestor) {
            for (let i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor)
            }
            ancestor.elm = vnode.elm
            if (patchable) {
              for (let i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, ancestor)
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              const insert = ancestor.data.hook.insert
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (let i = 1; i < insert.fns.length; i++) {
                  insert.fns[i]()
                }
              }
            } else {
              registerRef(ancestor)
            }
            ancestor = ancestor.parent
          }
        }

        // destroy old node
        // 销毁掉
        // parentElm 就是 body
        if (isDef(parentElm)) {
          // 删除原有的 div#app
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }

    // 调用了一些钩子函数
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
```

new Vue 的过程通常有 2 种场景，一种是外部我们的代码主动调用 new Vue(options) 的方式实例化一个 Vue 对象；另一种是我们上一节分析的组件过程中内部通过 new Vue(options) 实例化子组件。