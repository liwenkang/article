## 第一章

LHS 就是为了赋值的取值. ＝操作符或调用函数时传入参数的操作都会导致关联作用域的赋值操作。

RHS 就是单纯的取值

1.2.5
    1.所有的LHS 
        var c = 
        a = 2
        var b = 
    2. 所有的 RHS
        foo()
        = a
        a
        + b

为啥要区分 LHS 和 RHS?
RHS 查不到数据的时候,会报引用错误(ReferenceError)
    查到数据,但是对这个变量的值进行不合理操作的话,会抛出类型异常(TypeError)
LHS 查不到数据的时候,会在全局作用域下创建一个具有该名称的变量(非严格模式下)
    在严格模式下,并不会创建一个全局变量,而是抛出 ReferenceError 异常

ReferenceError 和作用域的判定失败相关, typeError 代表作用域判别成功,但是对结果的操作非法

## 第二章

作用域就是一套规则,指定了引擎如何在当前作用域和嵌套的子作用域中根据标识符名称进行变量查找

词法作用域
动态作用域

eval 性能问题
with 会在取不到属性的时候,暴露全局变量

```js
function foo(obj) {
    with(obj) {
        a = 2
    }
}

var o2 = {
    b: 3
}

foo(o2)
console.log(o2.a) // undefined
console.log(a) // 2
```

编译的词法分析阶段基本能够知道全部标识符在哪里以及是如何声明的，从而能够预测在执行过程中如何对它们进行查找.

## 第三章

为了保证 undefined 真的是 undefined
```js
undefined = true; // 给其他代码挖了一个大坑！绝对不要这样做！

(function IIFE( undefined ) {
    console.log('undefined', undefined)
    var a;
    if (a === undefined) {
        console.log( "Undefined is safe here!" );
    }
})();
```

另一个块作用域非常有用的原因和闭包及回收内存垃圾的回收机制相关。
```js
function process(data) {
// 在这里做点有趣的事情
}
// 在这个块中定义的内容可以销毁了！
{
    let someReallyBigData = { .. };
    process( someReallyBigData );
}
var btn = document.getElementById( "my_button" );
btn.addEventListener( "click", function click(evt){
console.log("button clicked");
}, /*capturingPhase=*/false );
```

## 第四章

函数优先,干掉重复声明
```js
foo(); // 1
var foo;
function foo() {
    console.log( 1 );
}
foo = function() {
    console.log( 2 );
};

// 会输出 1 而不是 2 ！这个代码片段会被引擎理解为如下形式：
function foo() {
    console.log( 1 );
}
foo(); // 1
foo = function() {
    console.log( 2 );
};
```

## 第五章

通过将函数传递到所在的词法作用域之外时, 就会持有对原始定义作用域的引用(也就是说在传递函数的时候,将函数定义位置所在的作用域也传过去了)

回调函数就是在使用闭包

如果将函数（访问它们各自的词法作用域）当作第一级的值类型并到处传递，你就会看到闭包在这些函数中的应用.

循环和闭包

```js
for (var i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i*1000 );
}
// 6 6 6 6 6 i 的值是循环结束时的值

for (let i = 0; i < 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, i * 1000)
}
```

如何在 for 循环中使用 setTimeout 还可以输出符合预想的结果

```js
for (var i = 0; i < 5; i++) {
    // IIFE 会通过声明并立即执行一个函数来创建作用域。
    (function () { // 重要
        var j = i // 重要,立即执行函数需要有自己的变量，用来在每个迭代中储存 i 的值：
        setTimeout(function timer() { 
            console.log(j)
        }, j * 1000)
    })()
}

for (var i = 0; i < 5; i++) {
    (function (j) {
        setTimeout(function timer() {
            console.log(j)
        }, j * 1000)
    })(i)
}

for (var i = 0; i < 5; i++) {
    let j = i
    setTimeout(function timer() {
        console.log(j)
    }, j * 1000)
}

for (let i = 0; i < 5; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, i * 1000)
}
```

for 循环头部的 let 声明还会有一个特殊的行为。这个行为指出变量在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。

```js
for (let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i*1000);
}
```

5.5 模块
```js
function CoolModule() { // 这是一个模块创建器
    var something = "cool";
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join("!"));
    }
    // 2. 封闭函数必须返回至少一个内部函数,内部函数在私有作用域内形成闭包,可以访问和修改私有状态
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

// 模块模式的两个必要条件
var foo = CoolModule(); // foo 1. 就是外部封闭函数,至少被调用一次,每次调用都会创建一个新的模块实例foo.doSomething(); // cool   
foo.doAnother(); // 1 ! 2 ! 3
```

```js
// 单例模式,采用立即执行函数
var foo = (function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];
    function doSomething() {
        console.log( something );
    }
    function doAnother() {
        console.log( another.join( " ! " ) );
    }
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
})();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

通过在模块实例的内部保留对公共 API 对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值

```js
var foo = (function CoolModule(id) {
    function change() {
        // 修改公共 API
        publicAPI.identify = identify2;
    }
    function identify1() {
        console.log( id );
    }
    function identify2() {
        console.log( id.toUpperCase() );
    }
    var publicAPI = {
        change: change,
        identify: identify1
    };
    return publicAPI;
})( "foo module" );

foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE
```

词法作用域是在写代码或者说定义时确定的，而动态作用域是在运行时确定的。（this 也是！）词法作用域关注函数在何处声明，而动态作用域关注函数从何处调用。

catch 具有块作用域

如果使用严格模式（strict mode），那么全局对象将无法使用默认绑定，因此 this 会绑定
到 undefined：
```js
function foo() {
    "use strict";
    console.log( this.a );
}
var a = 2;  
foo(); // TypeError: this is undefined
```

这里有一个微妙但是非常重要的细节，虽然 this 的绑定规则完全取决于调用位置，但是只有 foo() 运行在非 strict mode 下时，默认绑定才能绑定到全局对象；严格模式下与 foo() 的调用位置无关：

```js
function foo() {
    console.log( this.a );
}
var a = 2;
(function(){
    "use strict";
    foo(); // 2
})()
```