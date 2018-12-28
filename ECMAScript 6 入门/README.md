# 这是学习 ECMAScript6 入门的笔记

## 2. let 和 const 命令

块级作用域,没有声明提前,不可重复声明

```js
// IIFE 写法
(function () {
  var tmp = ...;
  ...
}());

// 块级作用域写法
{
  let tmp = ...;
  ...
}
```

```js
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function

// 实际相当于
// 浏览器的 ES6 环境
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```

const 所保证的是变量指向的内存地址所保存的数据不得改动.
简单类型的数据,值就保存在变量指向的内存地址中,所以就是常量
复合类型的数据,变量指向的内存地址只保存了一个指向实际数据的指针,保证指针是固定的
也就是说,const 声明的数组/对象,并不能保证数据不改变,而只能保证指针不变(不会指向其它数组/对象)
真正的冻结对象,应该用 Object.freeze() 来保证

```js
// 彻底冻结一个对象
var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach((key) => {
        if(typeof obj[key] === 'object') {
            // 递归冻结
            constantize(obj[key])
        }
    })
}
```

var, function 声明的全局变量是顶层对象(浏览器中的 window/self, Node 中的 global)的属性
let, class, const 声明的全局变量不再是顶层对象的属性

什么时候 this 会指向顶层对象?
全局环境下, this 指向顶层对象,但是在 Node 模块和 ES6 模块中, this 返回的是当前模块
函数里的 this ,如果不作为函数的方法运行,而是单纯作为函数运行,会指向顶层对象(但是在严格模式下,会返回 undefined )
new Function('return this')() 在浏览器不开启 CSP（Content Security Policy，内容安全策略）的情况下,可以返回全局对象
```js
// 为了在不同环境下拿到顶层对象
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
};
```

## 3. 变量的解构赋值

### 数组的解构赋值
只要一个数据结构具有 iterator 接口,它就可以使用数组的解构赋值(例如 Array, Set 以及其它手动实现了 iterator 的数据结构)

```js
// todo 这里要看完 Generator 函数后重新回顾
function* fibs() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

在使用默认值的时候,注意只有提供的值 === undefined,才会进行替代
```js
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

```js
// 表达式是惰性求值的
function f() {
  console.log('aaa');
}

// 此处的 f() 根本就没有运行
let [x = f()] = [1]; 
// x => 'aaa'

let x;
if ([1][0] === undefined) {
  x = f();
} else {
  x = [1][0];
}
```

### 对象的解构赋值:

数组根据顺序确定取值, 对象根据属性名决定取值
```js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
// 注意此处的 foo 是 undefined,相当于 foo 只做了一次传递

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'

let { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"
foo // error: foo is not defined
// 对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。
```

解构失败的话,会用到默认值 undefined

对象赋值的核心,是区别什么是变量(最后我能取到的值),什么是模式(为了取到某个值,我需要用到的匹配)

```js
// 对于已声明的变量用于解构赋值的时候
// 大括号开头的部分会被 JavaScript 解释为代码块
let x;
{x} = {x: 1};
// SyntaxError: syntax error

// 为解决这个问题,应该加上小括号
let x;
({x} = {x: 1});
```

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

### 函数的参数也能做解构赋值
```js
// 注意区分
// 为单独的变量设定默认值
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); //[3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move();  // [0, 0]

// 函数参数的默认值
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({});  // [undefined, undefined]
move(); // [0, 0] 这个时候就是函数参数为 undefined, 直接被默认值替代掉了
```

由于解构赋值中的模式上(也就是为了匹配所用到的部分)使用 () 可能会产生歧义,所以不要这么做
只有一种情况可以使用 () 在解构赋值中,就是 () 用在了变量上(最后我拿到的值),而且是在赋值中,不能在声明中

解构赋值的用途:
交换变量的值
从函数返回多个值(使用数组/对象),最后通过数组/对象解构取值
```js
// 返回一个数组
function example() {
  return [1, 2, 3];
}
let [a, b, c] = example();

// 返回一个对象
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();
```

给函数传参的时候,可以直接传入数组/对象,然后在形参上面做解构赋值
```js
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```

提取 JSON 数据
```js
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

设置函数的默认参数

for-of 遍历对象(具有 iterator 接口的)
```js
const map = new Map();
map.set('first', 'hello');
map.set('second', 'world');

for (let [key, value] of map) {
  console.log(key + " is " + value);
}
```

模块的加载
```js
const { SourceMapConsumer, SourceNode } = require("source-map");
```

## 4. 字符串的扩展

String.prototype.codePointAt 可以用于识别一个字符是两个字节还是四个字节组成的

```js
function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}

is32Bit("𠮷") // true
is32Bit("a") // false
```
JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。
for-of 可以正确识别 32 位的 UTF-16 字符。
```js
let s = '𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
// 20bb7
// 61
```

String.fromCodePoint() 和前面的互逆操作
```js
String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
// x🚀y
```

由于字符串有了 iterator 接口,所以使用 for-of 可以识别大于0xFFFF的码点,传统的 for 循环无法识别

针对欧洲字符,字符串的 normalize 方法可以把视觉和语义都相同,但 JavaScript 不能识别的字符串转换为相同的

includes(), startsWith(), endsWith()
endsWith 的第二个参数相当于在 str.slice(0, 第二个参数),也就是说,第二个参数所在位置的内容将会丢弃

repeat()

padStart(填充后的字符串长度, 用啥填充), padEnd() 
可以用来为数字填充位数
```js
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
```

模版字符串 `` ${里面是表达式}

标签模版
```js
let a = 5;
let b = 10;

const x = tag`${b}Hello ${ a + b } world${a}`;
const y = tag(['', 'Hello ', ' world', ''], 10, 15, 5);
x === y // true

// tag函数的第一个参数是一个数组，该数组的成员是模板字符串中那些没有变量替换的部分
// 变量替换只发生在数组的第一个成员与第二个成员之间、第二个成员与第三个成员之间，以此类推。
```
应用: 过滤 html 字符串,防止输入恶意内容
```js
function SaferHTML(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
        let arg = String(arguments[i]);

        // Escape special characters in the substitution.
        // 转换掉 &, <, > 这种特殊符号
        s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
}
let sender = '<script>alert("abc")</script>'; // 恶意代码
let message1 = `<p>${sender} has sent you a message.</p>`;
// 在浏览器就会执行恶意代码
// <p><script>alert("abc")</script> has sent you a message.</p> 
let message2 = SaferHTML`<p>${sender} has sent you a message.</p>`;
// 转义之后就可以避免这种问题
// <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p> 
```

关于多语言转换这边,要参考 vue-i18n 这个库的设计

```js
tag`First line\nSecond line`

function tag(strings) {
  console.log(strings.raw[0]);
  // strings.raw[0] 为 "First line\\nSecond line"
  // strings.raw 数组会将\n视为\\和n两个字符，而不是换行符。
  // 打印输出 "First line\nSecond line"
}
```

String.raw
```js
// 处理了变量和斜杠
String.raw`Hi\n${2+3}!`;
// 返回 "Hi\\n5!"

String.raw`Hi\u000A!`;
// 返回 "Hi\\u000A!"

String.raw`Hi\\n`
// 返回 "Hi\\\\n"

// 作为普通函数使用的时候:
String.raw({ raw: 'test' }, 0, 1, 2);
// 't0e1s2t'

// 等同于
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);

// String.raw 的实现
String.raw = function (strings, ...values) {
  let output = '';
  let index;
  for (index = 0; index < values.length; index++) {
    output += strings.raw[index] + values[index];
  }

  output += strings.raw[index]
  return output;
}
```

5. 正则的扩展

RegExp 构造函数
```js
// 注意当第二个参数存在的时候, 前面的标记就作废了
new RegExp(/abc/ig, 'i').flags
// "i"
```

字符串对象共有 4 个方法，可以使用正则表达式：match()、replace()、search()和split()。

正则这章先跳过了...

6. 数值的扩展

二进制 0b(0B)
八进制 0o(0O)
```js
Number('0b111')  // 7
Number('0o10')  // 8
```

```js
// 在编码规范中,推荐使用 Number 上的方法,因为它避免了隐式的类型转换
isFinite(25) // true
isFinite("25") // true, "25"先转换为了了25
Number.isFinite(25) // true
Number.isFinite("25") // false

isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
Number.isNaN(1) // false
```

```js
// 将全局方法移植到了 Number 上
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```

```js
// 判断数字是否是整数,注意它的精度有一定范围
Number.isInteger()

Number.isInteger(3.0000000000000002) // true

// 如果一个数值的绝对值小于Number.MIN_VALUE（5E-324），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，Number.isInteger也会误判。
Number.isInteger(5E-324) // false
Number.isInteger(5E-325) // true
```

```js
// 1 和大于 1 的最小浮点数之间的差值
Number.EPSILON === Math.pow(2, -52)
// 利用这个值,就可以设置能够接受的误差范围
```

```js
// 安全数的检测
Number.isSafeInteger()
// 注意如果做的是一个大数的运算,要将参与计算的每一个值都进行检测
```

Math.imul方法可以返回正确的低位数值。

```js
// 指数运算符(右结合)
// 相当于 2 ** (3 ** 2)
2 ** 3 ** 2
// 512
```

后面的方法感觉太不常用了...略过

7. 函数的扩展

函数参数的默认值
参数变量是默认声明的，所以不能用let或const再次声明。
```js
// 参数不能有同名参数
function foo(x = 5) {
  let x = 1; // error
  const x = 2; // error
}

// 注意 x 的值
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

```js
// 写法一
function m1({x = 0, y = 0} = {}) {
    return [x, y];
}

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
    return [x, y];
}

// m1() 和 m2() 都返回 [0, 0]
// m1({}) 和 m2({}) 分别返回 [0, 0] 和 [undefined, undefined]
// m1({x: 1}) 和 m2({x: 1}) 分别返回 [1, 0] 和 [1, undefined]

// 默认值的触发条件是 undefined
```

函数的 length 是返回没有指定默认值的参数个数(并且默认参数的位置一定要放在形参的末尾才可以)

```js
let x = 1;

function f(y = x) {
    let x = 2;
    console.log(y);
}

f();

// 注意此处的 x 没有定义,所以指向了外层的变量 x.
```

```js
let foo = 'outer';

function bar(func = () => foo) {
  let foo = 'inner';
  console.log(func());
}

bar(); // outer
// 函数 bar 的参数 func 的默认值是一个匿名函数，返回值为变量 foo。
// 函数参数形成的单独作用域里面，并没有定义变量foo，所以foo指向外层的全局变量foo，因此输出outer。
// 作用域链...找不到就继续往外招
```

```js
var x = 1;
function foo(x, y = function() { x = 2; }) {
    var x = 3; // 注意此处的 x 和形参里的 x 处于不同的作用域,所以不会相互影响
    y(); // y() 的执行,影响的是形参作用域里的 x 的值
    console.log('x', x); // 这里拿到的就是 var x 里面的值
}

foo() // 输出为 3
console.log(x) // 由于函数内部改变了自己的 x ,所以全局的 x 没有发生改变,输出为 1
```

```js
var x = 1;
function foo(x, y = function() { x = 2; }) {
    // 此处的 x 是 undefined
    x = 3; // 注意此处的 x 和形参里的 x 处于相同的作用域
    // 此处的 x 就是 3
    y(); // y() 的执行,影响的就是上一行中 x 的值
    // 此处的 x 就是 2
    console.log('x', x); // 这里拿到的就是 y() 执行之后 x 的值
}

foo() // 输出为 2
console.log(x) // 由于函数内部改变了自己的 x ,所以全局的 x 没有发生改变,输出为 1
```

借助这个特点,可以设置一个函数的参数值是必须的,或者是可以省略的
```js
// 必须的
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function bar(mustBeProvided = throwIfMissing()) {}

// 可以省略的
function foo(optional = undefined) {}
``` 

rest ...符号
可以代替 arguments 作为真正的数组
要放在形参的最后
只要参数使用了默认值、解构赋值、或者扩展运算符，就不能显式指定严格模式。
```js
// 两种方法可以规避这种限制。第一种是设定全局性的严格模式，这是合法的。
'use strict';
function doSomething(a, b = a) {
  // code
}

// 第二种是把函数包在一个无参数的立即执行函数里面。
const doSomething = (function () {
  'use strict';
  return function(value = 42) {
    return value;
  };
}());
```

function.name 返回的是函数名(以及匿名函数所赋值给的变量)

箭头函数
```js
// 直接返回对象的时候,应该套上一层小括号
let getTempItem = id => ({ id: id, name: "Temp" });
```

```js
var id = 1;

function foo() {
    var id = 2
    console.log('id outside1:', this.id, this === global);
    setTimeout(() => {
        console.log('id inside1:', this.id, this === global);
    }, 100);
}

foo.call({id: 3}) 
// 注意!!
// 在 node 运行环境下 this 的指向是 global, this.id 是传入的 id 值为3
// 在浏览器环境下 this 的指向是传入的对象(函数定义生效时所在的对象), this.id 是传入的 id 值为3
```

```js
var id = 1;

function foo() {
    var id = 2
    this.id = 3
    setTimeout(() => {
        console.log('id:', this.id);
    }, 100);
}

foo.call({ id: 4 }); // 3
foo(); // 3
// 传入的 this.id 经过修改,变成了 3
```

```js
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数
  setInterval(() => this.s1++, 1000);
  // 普通函数
  setInterval(function () {
    this.s2++; // 这里无法取到外层的 this.s2
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0
```

```js
var handler = {
  id: '123456',

  init: function() {
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
      // this 指向的是 handler 对象
      // 如果不用箭头函数的话, this 指向的会是 document
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
```

箭头函数没有自己的 this ,所以内部的 this 实际是外部的 this 
不能使用 apply, bind, call, arguments

不应该使用箭头函数的场合
```js
// 1. 调用cat.jumps()时，如果是普通函数，该方法内部的this指向cat；
// 如果写成箭头函数，使得 this 指向全局对象，因此不会得到预期结果。
const cat = {
    lives: 9,
    jumps1: () => {
        console.log(this.lives) // undefined, 这里的 this 指向的是 全局
    },
    jumps2: function () {
        console.log(this.lives) // 9, 这里的 this 指向的是 cat
    }
}

// 2. 需要动态this的时候，也不应使用箭头函数。
// 下面代码运行时，点击按钮会报错，因为button的监听函数是一个箭头函数，导致里面的this就是全局对象。如果改成普通函数，this就会动态指向被点击的按钮对象。
var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on');
});
```

尾调用: 一个函数的最后一步是返回一个函数
尾调用优化: 即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。(注意,只有不再用到外层函数的内部变量)
```js
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
// 上面代码中，如果函数g不是尾调用，函数f就需要保存内部变量m和n的值、g的调用位置等信息。但由于调用g之后，函数f就结束了，所以执行到最后一步，完全可以删除f(x)的调用帧，只保留g(3)的调用帧。

// 不是尾调用: 
function addOne(a){
  var one = 1;
  function inner(b){
    return b + one;
  }
  return inner(a); // 这种不属于尾调用, 因为 inner 还用到了 addOne
}
```

函数尾调用自身,就是尾递归:
```js
// 阶乘的一般写法
// 计算n的阶乘，最多需要保存n个调用记录，复杂度 O(n) 
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120

// 尾递归的写法
// 只保留一个调用记录，复杂度 O(1)
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```

```js
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出
Fibonacci(500) // 堆栈溢出

// 如果使用 尾递归优化的话,就不会出现堆栈溢出的问题了
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
    if( n <= 1 ) {return ac2};
    return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}
```

尾调用优化对于递归的作用很大,可以避免栈溢出,节省内存

函数的柯里化（currying），意思是将多参数的函数转换成单参数的形式。
```js
function currying(fn, n) {
  return function(m) {
    return fn.call(this, m, n)
  }
}
```

```js
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}

function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);
factorial(5) // 120
```

```js
// 利用默认值减少传入参数
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120
```

一旦使用递归,就最好使用尾递归
尾调用模式仅在严格模式下生效

```js
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

sum(1, 100000)
```
为了在正常模式下使用尾递归优化,可以自己实现尾递归优化
利用循环,替代递归
然后，每一轮递归sum返回的都是undefined，所以就避免了递归执行；而accumulated数组存放每一轮sum执行的参数，总是有值的，这就保证了accumulator函数内部的while循环总是会执行。这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。
函数参数的尾逗号

函数形参的末尾可以写逗号

扩展运算符: ... (将数组转换为用逗号分隔的参数序列)
将数组转换为函数的参数时, 可以替代 apply 
```js
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);
```

连接两个数组生成新数组的时候, 可以用 push 搭配 ... 或 concat()

数组浅复制可以采用的方法:
```js
newArr = arr.slice()
newArr = arr.concat()
newArr = [...arr]
```

```js
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
// 正确识别四个字节的 Unicode 字符。
// 返回字符串长度的函数，可以像下面这样写。
function length(str) {
  return [...str].length;
}

// 可以避免 JavaScript 将大于\uFFFF的 Unicode 字符，算作两个字符的 bug。
function countSymbols(string) {
  return Array.from(string).length;
}
```

只要实现了 Iterator 接口的对象,都可以使用扩展运算符 ... 转换为真正的数组
如果没有此接口的(比如类数组对象),只能使用 Array.from()

扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。
Array.from方法还支持类似数组的对象。
所谓类似数组的对象(Array-like Object)，本质特征只有一点，即必须有length属性。
因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

```js
// 第二个参数是一个 map 的回调
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).m ap(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```

Array.of基本上可以用来替代Array()或new Array(),并且不存在由于参数不同而导致的重载。它的行为非常统一。
```js
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

```js
// 在当前数组内部，将指定位置的成员复制到其他位置
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]
```


```js
// find,findIndex
[1, 4, -5, 10].find((n) => n < 0)
// -5

// find 可以解决 NaN 的查找问题
[NaN].find(item => Object.is(NaN, item))
[NaN].indexOf(NaN)
// -1

[NaN].find(y => Object.is(NaN, y))
[NaN].findIndex(y => Object.is(NaN, y))
// 0

// 都可以指定 this
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26
```

```js
// array 的 fill 方法,填充数组
// 注意如果填充的是对象,那么被赋值的是同一个内存对象,而不是深拷贝
```

```js
// 数组的 entries()，keys() 和 values()
// 分别对应 键值对/键/值
```

```js
// includes 方法可以判断 NaN

// Map 结构的has方法，是用来查找键名的，
// 比如Map.prototype.has(key)、WeakMap.prototype.has(key)、Reflect.has(target, propertyKey)。
// Set 结构的has方法，是用来查找值的，
// 比如Set.prototype.has(value)、WeakSet.prototype.has(value)。
```


```js
// flat 用来数组降维
// flatMap() = map + flat 
// 对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），
// 然后对返回值组成的数组执行flat()方法。
// 该方法返回一个新数组，不改变原数组。

// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
// flatMap()只能展开一层数组。

// 相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
[1, 2, 3, 4].flatMap(x => [[x * 2]])
// [[2], [4], [6], [8]]
```

```js
// ES5 对于空位的处理
// forEach(), filter(), reduce(), every() 和some()都会跳过空位。
// map()会跳过空位，但会保留这个值
// join()和toString()会将空位视为undefined，而undefined和null会被处理

// ES6 对于空位的处理,一般设定为 undefined
// Array.from
// ...
// copyWithin
// fill
// for...of
// entries()、keys()、values()、find()、findIndex() 都将处理为 undefined
```

## 9.对象的扩展

```js
const foo = 'bar';
const baz = {foo};
baz // {foo: "bar"}

// 等同于
const baz = {foo: foo};
// 注意,这里的属性名是静态的,相当于
const baz = {'foo': foo};
// 属性值是变量,所以结果是
const baz = {'foo': 'bar'};
// 也就是属性名为变量名, 属性值为变量的值。

// 如果想动态设置属性名,需要用:
var obj = {};
obj[setAttrName] = 'Tom'
```

```js
const o = {
  method() {
    return "Hello!";
  }
};

// 等同于

const o = {
  method: function() {
    return "Hello!";
  }
};
```

```js
const obj = {
  class () {}
};

// 等同于

var obj = {
  'class': function() {}
};
```

如果某个方法的值是一个 Generator 函数，前面需要加上星号。
```js
const obj = {
  * m() {
    yield 'hello world';
  }
};
```

属性名表达式:
```js
// 方法一
obj.foo = true;
// 方法二
obj['a' + 'bc'] = 123;
```

可枚举属性
```js
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```

有四个操作会忽略 enumerable 为 false 的属性。

for...in 循环：只遍历对象自身的和继承的可枚举的属性。
Object.keys()：返回对象自身的所有可枚举的属性的键名。
JSON.stringify()：只串行化对象自身的可枚举的属性。
Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。

遍历对象属性的方法
（1）for...in
for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
（2）Object.keys(obj)
Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
最常用的遍历方法
（3）Object.getOwnPropertyNames(obj)
Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
（4）Object.getOwnPropertySymbols(obj)
Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
（5）Reflect.ownKeys(obj)
Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

遍历次序:
首先遍历所有数值键，按照数值升序排列。
其次遍历所有字符串键，按照加入时间升序排列。
最后遍历所有 Symbol 键，按照加入时间升序排列。

super 关键字
```js
// super，指向当前对象的原型对象。

const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    // 注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。
    // 只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto); // 这里改变了 obj.__proto__ = proto
obj.find() // "hello"
// 上面代码中，对象obj.find()方法之中，通过super.foo引用了原型对象proto的foo属性。
```

```js
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x); // 这里的 this 依然指向的是 obj
  },
};

const obj = {
  x: 'world',
  foo() {
    super.foo(); // 指向的是 proto.foo() 
  }
}

Object.setPrototypeOf(obj, proto);
obj.foo() // "world"
```

```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }

// 解构赋值是浅拷贝
let obj = { a: { b: 1 } };
let { ...x } = obj;
obj.a.b = 2;
x.a.b // 2

// 扩展运算符的解构赋值，不能复制继承自原型对象的属性。
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
o3 // { b: 2 }, 读得到自有属性 b
o3.a // undefined, 读不到继承来的属性 a

// 注意 Object.create 相当于设置了 o.__proto__ = {}
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```

```js
// 完整克隆一个对象，还拷贝对象原型的属性，可以采用下面的写法。

// 写法一
const clone1 = {
  __proto__: Object.getPrototypeOf(obj),
  ...obj
};

// 写法二
const clone2 = Object.assign(
  Object.create(Object.getPrototypeOf(obj)),
  obj
);

// 写法三
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
```

合并两个对象:
```js
let ab = {...a, ...b}
// 等同于
let ab = Object.assign({}, a, b)
```

10. 对象的新增方法

Object.is 可以用来做 === 判断(针对 +0,-0可以正确分辨, 对于两个 NaN 可以判断为相同)

Object.assign 将源对象的可枚举属性复制到目标对象,且同名后者覆盖前者
```js
const target = { a: 1, b: 1 };

const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

```js
// 只有字符串合入目标对象（以字符数组的形式），数值和布尔值都会被忽略。
// 这是因为只有字符串的包装对象，会产生可枚举属性。
const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1, v2, v3);
console.log(obj); // { "0": "a", "1": "b", "2": "c" }

// 原因: 转换为包装对象的时候, 只有字符串的包装对象会产生可枚举的实义属性
Object(true) // {[[PrimitiveValue]]: true}
Object(10)  //  {[[PrimitiveValue]]: 10}
Object('abc') // {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}
```

Object.assign 注意点:
浅拷贝
同名属性的替换
处理数组的时候,会当成对象处理
对于属性是取值函数的时候,那么求值之后再复制

作用:
```js
// （1）为对象添加属性
class Point {
  constructor(x, y) {
    Object.assign(this, {x, y});
    // 相当于 this.x = x  this.y = y
  }
}

// (2) 为对象添加方法
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) {
  ···
};
SomeClass.prototype.anotherMethod = function () {
  ···
};

// (3) 克隆对象,一般只克隆自身的值
// 如果需要克隆一个对象继承的值
function cloneWithInherit (origin) {
  let originProto = Object.getPrototypeOf(origin) // 获取 __proto__ 上的内容
  return Object.assign(Object.create(originProto), origin) // 以 origin 的 originProto 为 __proto__ ,克隆对象
}

// (4)合并多个对象

// (5)为属性指定默认值
// 由于浅拷贝的问题,所以 合并的内容最好都是简单类型,如果是对象的话,可能存在直接替换的情况
// 这是默认参数
const DEFAULTS = {
  logLevel: 0,
  outputFormat: 'html'
};

function processContent(options) {
  options = Object.assign({}, DEFAULTS, options); // options 是用户自定义内容
  console.log(options);
  // ...
}
```


```js
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }

// 手动实现
function getOwnPropertyDescriptors(obj) {
  const result = {};
  for (let key of Reflect.ownKeys(obj)) {
    result[key] = Object.getOwnPropertyDescriptor(obj, key);
  }
  return result;
}

// Reflect.ownKeys(obj) 和 Object.keys(obj) 都是遍历对象键名的方法 
// Reflect.ownKeys 会拿到键名为 symbol 的
// Objcet.keys 拿不到
```

getOwnPropertyDescriptors 方法,是为了解决无法拷贝 set/get 的问题
```js
const source = {
    set foo(value) {
        console.log(value);
    }
};

const target1 = {};
Object.assign(target1, source); // 无法正确拷贝 source 里的 set 和 get
// Object.assign 方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。
Object.getOwnPropertyDescriptor(target1, 'foo') 
// { value: undefined,  
//   writable: true,
//   enumerable: true,
//   configurable: true }

// 为了正确拷贝,就要用到 getOwnPropertyDescriptors
const source = {
    set foo(value) {
        console.log(value);
    }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
log(Object.getOwnPropertyDescriptor(target2, 'foo'))
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
```

__proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
设置原型对象
获取原型对象

Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用。
```js
var obj = { foo: 'bar', baz: 42 };
log(Object.keys(obj))
// 和下面拿到的相同
log(Reflect.ownKeys(obj))

let {keys, values, entries} = Object;
let obj = { a: 1, b: 2, c: 3 };

for (let key of keys(obj)) {
  console.log(key); // 'a', 'b', 'c'
}

// Object.values只返回对象自身的可遍历属性。
// 会过滤属性名为 Symbol 值的属性。
for (let value of values(obj)) {
  console.log(value); // 1, 2, 3
}

// 对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。
// 如果原对象的属性名是一个 Symbol 值，该属性会被忽略。
// 可以将对象转为真正的Map结构。
for (let [key, value] of entries(obj)) {
  console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}

// Object.fromEntries()方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。
// 例一
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

Object.fromEntries(entries)
// { foo: "bar", baz: 42 }

// 例二
const map = new Map().set('foo', true).set('bar', false);
Object.fromEntries(map)
// { foo: true, bar: false }

// 将 url 里的查询参数转换为对象
Object.fromEntries(new URLSearchParams('foo=bar&baz=qux'))
// { foo: "bar", baz: "qux" }
```

11. Symbol
```js
// 作为对象属性名称的 symbol 
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"

// Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的。
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```

```js
// 作为属性名的 symbol

let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

注意，Symbol 值作为对象属性名时，不能用点运算符。
在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中。
```js
let s = Symbol();

let obj = {
  [s]: function (arg) { ... }
};
obj[s](123);

// 函数可以缩写
let obj = {
  [s](arg) { ... }
};
```

```js
// 利用 symbol 解决魔术字符串的问题
function getArea(shape, options) {
  let area = 0;

  switch (shape) {
    case 'Triangle': // 魔术字符串
      area = .5 * options.width * options.height;
      break;
    /* ... more code ... */
  }

  return area;
}

getArea('Triangle', { width: 100, height: 100 }); // 魔术字符串

const shapeType = {
  // 将字符串变为对象的一个属性,值为 symbol 
    triangle: Symbol()
};

function getArea(shape, options) {
    let area = 0;

    switch (shape) {
        case shapeType.triangle: // 魔术字符串
            area = .5 * options.width * options.height;
            break;
        /* ... more code ... */
    }
    log(area)
    return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 }); // 魔术字符串
```

Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。
```js
const obj = {};

let foo = Symbol("foo");

Object.defineProperty(obj, foo, {
  value: "foobar",
});

for (let i in obj) {
  console.log(i); // 无输出
}

Object.getOwnPropertyNames(obj)
// []

Object.getOwnPropertySymbols(obj)
// [Symbol(foo)]
```
使用Object.getOwnPropertyNames方法得不到Symbol属性名，需要使用Object.getOwnPropertySymbols方法。

Symbol 值作为名称的属性，不会被常规方法遍历得到。
我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
```js
let size = Symbol('size');

class Collection {
  constructor() {
    this[size] = 0;
  }

  add(item) {
    this[this[size]] = item;
    this[size]++;
  }

  static sizeOf(instance) {
    return instance[size];
  }
}

let x = new Collection();
Collection.sizeOf(x) // 0

x.add('foo');
Collection.sizeOf(x) // 1

Object.keys(x) // ['0']
Object.getOwnPropertyNames(x) // ['0']
Object.getOwnPropertySymbols(x) // [Symbol(size)]
// 对象 x 的 size 属性是一个 Symbol 值，所以 Object.keys(x)、Object.getOwnPropertyNames(x) 都无法获取它。这就造成了一种非私有的内部方法的效果。
```

我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
```js
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```
两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。
Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。
比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。

Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
需要注意的是，Symbol.for为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。

symbol 在 node 中的一个用途:
对于 Node 来说，模块文件可以看成是一个类。保证每次执行这个模块文件，返回的都是同一个实例
```js
// mod.js
const FOO_KEY = Symbol('foo');

function A() {
  this.foo = 'hello';
}

if (!global[FOO_KEY]) {
  // 如果键名使用Symbol方法生成，那么外部将无法引用这个值，当然也就无法改写。
  global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];
```
仍然存在的问题
如果多次执行这个脚本，每次得到的FOO_KEY都是不一样的。虽然 Node 会将脚本的执行结果缓存，一般情况下，不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是绝对可靠。

Symbol.hasInstance
```js
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true

// foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。

class Even {
    [Symbol.hasInstance](obj) {
        return Number(obj) % 2 === 0;
    }
}

log(1 instanceof new Even()) // false
log(2 instanceof new Even()) // true
log(12345 instanceof new Even()) // false

// 有 static, 不能在类的实例上调用静态方法，而应该通过类本身调用。这些通常是实用程序方法，例如创建或克隆对象的功能。

class Even {
    static [Symbol.hasInstance](obj) {
        return Number(obj) % 2 === 0;
    }
}

log(1 instanceof Even) // false
log(2 instanceof Even) // true
log(12345 instanceof Even) // false

// 说明 static 的使用
class ClassWithStaticMethod {
  static staticMethod() {
    return 'static method has been called.';
  }
}

console.log(ClassWithStaticMethod.staticMethod());
```

对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开。
数组默认可以展开, 也就是 concat 方法可用
类数组对象默认不可以展开,也就是 concat 方法无效

Symbol.isConcatSpreadable属性也可以定义在类里面。
```js
class A1 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = true;
  }
}
class A2 extends Array {
  constructor(args) {
    super(args);
  }
  get [Symbol.isConcatSpreadable] () {
    return false;
  }
}
// A1是定义在实例上，A2是定义在类本身，效果相同。
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2)
// [1, 2, 3, 4, [5, 6]]
```

对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。
```js
class MyArray extends Array {
}

const a = new MyArray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(x => x > 1);

b instanceof MyArray // true
b instanceof Array // true
c instanceof MyArray // true
b instanceof Array // true
```

```js
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
// 由于定义了Symbol.species属性，创建衍生对象时就会使用这个属性返回的函数，作为构造函数。

const a = new MyArray();
const b = a.map(x => x);

b instanceof MyArray // false
b ins
tanceof Array // true
```

它主要的用途是，有些类库是在基类的基础上修改的，那么子类使用继承的方法时，作者可能希望返回基类的实例，而不是子类的实例。

对象的Symbol.match属性，指向一个函数。
当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值。
```js
class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}

'e'.match(new MyMatcher()) // 1
```

对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值
```js
const x = {};
x[Symbol.replace] = (...s) => console.log(s);
'Hello'.replace(x, 'World') // ["Hello", "World"]
```
Symbol.replace方法会收到两个参数，第一个参数是replace方法正在作用的对象，上面例子是Hello，第二个参数是替换后的值，上面例子是World。

对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值。
```js
class MySearch {
    constructor(value) {
        this.value = value;
    }
    [Symbol.search](string) {
        return string.indexOf(this.value);
    }
}

'foobar'.search(new MySearch('foo'))
```

对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值。
```js
class MySplitter {
    constructor(value) {
        this.value = value;
    }
    [Symbol.split](string) {
        let index = string.indexOf(this.value);
        if (index === -1) {
            log(string);
        }
        log([
            string.substr(0, index),
            string.substr(index + this.value.length)
        ]);
    }
}

'foobar'.split(new MySplitter('foo'))
// ['', 'bar']

'foobar'.split(new MySplitter('bar'))
// ['foo', '']

'foobar'.split(new MySplitter('baz'))
// 'foobar'
```

对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器
```js
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

Symbol.toPrimitive被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。
Number：该场合需要转成数值
String：该场合需要转成字符串
Default：该场合可以转成数值，也可以转成字符串
```js
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};

2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'
```

对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。
可以用来定制[object Object]或[object Array]中object后面的那个字符串。
```js
// 例一
log(({[Symbol.toStringTag]: 'Foo'}.toString()))
// "[object Foo]"

// 例二
class Collection {
    get [Symbol.toStringTag]() {
        return 'xxx';
    }
}
let x = new Collection();
log(Object.prototype.toString.call(x)) // "[object xxx]"
```

对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。
```js
// 没有 unscopables 时
class MyClass {
    foo() { return 1; }
}

var foo = function () { return 2; };

with (MyClass.prototype) {
    log(foo()) // 1
}

// 有 unscopables 时
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}

var foo = function () { return 2; };

with (MyClass.prototype) {
  foo(); // 2
}
```
上面代码通过指定Symbol.unscopables属性，使得with语法块不会在当前作用域寻找foo属性，即foo将指向外层作用域的变量。

12. Set 和 Map 数据结构

Set 它类似于数组，但是成员的值都是唯一的，没有重复的值。
数组去重 [...new Set(array)] 以及 Array.from(new Set(array));
Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是 NaN 等于自身(NaN === NaN 返回 false)
对象总是不相等的

keys()：返回键名的遍历器
values()：返回键值的遍历器
entries()：返回键值对的遍历器
forEach()：使用回调函数遍历每个成员
需要特别指出的是，Set的遍历顺序就是插入顺序
因为 set 没有键名,只有键值(键名和键值都是同一个值)

```js
// Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
Set.prototype[Symbol.iterator] === Set.prototype.values
// true

// 这意味着，可以省略values方法，直接用for...of循环遍历 Set。
let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
// red
// green
// blue
```

WeakSet
WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。
首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```
WeakSet 没有size属性，没有办法遍历它的成员。
WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

```js
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
// 上面代码保证了Foo的实例方法，只能在Foo的实例上调用。这里使用 WeakSet 的好处是，foos对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑foos，也不会出现内存泄漏。
```

Map 是更好的一种'键值对'数据结构,各种类型的值（包括对象）都可以当作键
```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```
不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构（详见《Iterator》一章）都可以当作Map构造函数的参数

如果对同一个键多次赋值，后面的值将覆盖前面的值。
```js
const map = new Map();

map
.set(1, 'aaa')
.set(1, 'bbb');

map.get(1) // "bbb"
```
注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。
```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

同样的值的两个实例，在 Map 结构中被视为两个键。
```js
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```
上面代码中，变量k1和k2的值是一样的，但是它们在 Map 结构中被视为两个键。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。虽然NaN不严格相等于自身，但 Map 将其视为同一个键。
```js
let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

需要特别注意的是，Map 的遍历顺序就是插入顺序。

keys()：返回键名的遍历器。
values()：返回键值的遍历器。
entries()：返回所有成员的遍历器。
forEach()：遍历 Map 的所有成员。

```js
map[Symbol.iterator] === map.entries
```

如果所有 Map 的键都是字符串，它可以无损地转为对象。

```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}
```

```js
// Map 转为 JSON 要区分两种情况。一种情况是，Map 的键名都是字符串，这时可以选择转为对象 JSON。

function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
// 另一种情况是，Map 的键名有非字符串，这时可以选择转为数组 JSON。

function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```

WeakMap与Map的区别有两点。
首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。

WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。

总之，WeakMap的专用场合就是，它的键所对应的对象，可能会在将来消失。WeakMap结构有助于防止内存泄漏。
注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

```js
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```
即使在 WeakMap 外部消除了obj的引用，WeakMap 内部的引用依然存在。
WeakMap 没有遍历方法, 没有 size 属性.
只有四个方法可用：get()、set()、has()、delete()。
只要外部的引用消失，WeakMap 内部的引用，就会自动被垃圾回收清除。由此可见，有了 WeakMap 的帮助，解决内存泄漏就会简单很多。

用途:
前文说过，WeakMap 应用的典型场合就是 DOM 节点作为键名。下面是一个例子。
```js
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```
上面代码中，myElement是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是myElement。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

```js
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
  constructor(counter, action) {
    _counter.set(this, counter);
    _action.set(this, action);
  }
  dec() {
    let counter = _counter.get(this);
    if (counter < 1) return;
    counter--;
    _counter.set(this, counter);
    if (counter === 0) {
      _action.get(this)();
    }
  }
}

const c = new Countdown(2, () => console.log('DONE'));

c.dec()
c.dec()
// DONE
```
上面代码中，Countdown类的两个内部属性_counter和_action，是实例的弱引用，所以如果删除实例，它们也就随之消失，不会造成内存泄漏。

13. Proxy(就像一个拦截器)

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

var proxy = new Proxy(target, handler);
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。
```js
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35
```

```js
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
// 上面代码中，proxy对象是obj对象的原型，obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截。
```

同一个拦截器函数，可以设置拦截多个操作。
```js
var handler = {
    get: function(target, name) {
        if (name === 'prototype') {
            return Object.prototype;
        }
        return 'Hello, ' + name;
    },

    apply: function(target, thisBinding, args) {
        return args;
    },

    construct: function(target, args) {
        log('target', target)
        log('{value: args[1]}', {value: args[1]})
        return {value: args[1]};
    }
};

var fproxy = new Proxy(function(x, y) {
    return x + y;
}, handler);

fproxy(1, 2) // 1 这边相当于调用了 apply 的方法,其中 target 就是 new Proxy 中的第一个参数, args 是传入的参数
new fproxy(1, 2) // {value: 2} 这边相当于调用了 construct
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true
```

get 的拦截
三个参数分别为: 目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。
```js
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, property) {
    if (property in target) {
      return target[property];
    } else {
      throw new ReferenceError("Property \"" + property + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误
```

get 方案的继承
```js
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.foo // "GET foo"
```
上面代码中，拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，拦截会生效。

```js
var pipe = (function () {
  return function (value) {
    var funcStack = [];
    var oproxy = new Proxy({} , {
      get : function (pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function (val, fn) {
            return fn(val);
          },value);
        }
        // 在调用 get 之前,把所有的函数都存放起来
        // 直到 get 方法的时候,将函数们拿出来,一个接一个调用
        funcStack.push(window[fnName]);
        return oproxy;
      }
    });

    return oproxy;
  }
}());

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```

利用get拦截，实现一个生成各种 DOM 节点的通用函数dom。
```js
const dom = new Proxy({}, {
  get(target, property) {
    // property 拿到的是元素名称 div/ul/li 之类
    return function(attrs = {}, ...children) {
      // attrs 是 div 所对应的属性(以对象的形式)
      const el = document.createElement(property);
      for (let prop of Object.keys(attrs)) {
        el.setAttribute(prop, attrs[prop]);
      }
      // children 是输入的节点文本
      for (let child of children) {
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }
        el.appendChild(child);
      }
      return el;
    }
  }
});

const el = dom.div({},
  'Hello, my name is ',
  dom.a({href: '//example.com'}, 'Mark'),
  '. I like:',
  dom.ul({},
    dom.li({}, 'The web'),
    dom.li({}, 'Food'),
    dom.li({}, '…actually that\'s it')
  )
);

document.body.appendChild(el);
```

拦截所有的 get 重新指向
```js
const proxy = new Proxy({}, {
  get: function(target, property, receiver) {
    return receiver; // 这里指向的就是 proxy 对象(也就是构造出来的实例)
  }
});

const d = Object.create(proxy);
d.a === d // true
```

如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错。
```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```

set
拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。
```js
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        // 这是一种数据验证的方法
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

保护私有变量,防止这些内部属性被外部读写。
```js
const handler = {
    get (target, key) {
        invariant(key, 'get');
        return target[key];
    },
    set (target, key, value) {
        invariant(key, 'set');
        target[key] = value;
        return true;
    }
};

function invariant (key, action) {
    // 在 set 和 get 的时候,提前判断是否是私有属性
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`);
    }
}

const target = {};
const proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```

第四个参数返回的是 原始的操作行为所在的那个对象，一般情况下是proxy实例本身
```js
const handler = {
    set: function(obj, prop, value, receiver) {
        obj[prop] = receiver;
    }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
proxy.foo === proxy // true
```

```js
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
  }
};
const proxy = new Proxy({}, handler);
const myObj = {};
Object.setPrototypeOf(myObj, proxy);

myObj.foo = 'bar';
myObj.foo === myObj // true
// 上面代码中，设置myObj.foo属性的值时，myObj并没有foo属性，因此引擎会到myObj的原型链去找foo属性。myObj的原型对象proxy是一个 Proxy 实例，设置它的foo属性会触发set方法。这时，第四个参数receiver就指向原始赋值行为所在的对象myObj。
```

如果目标对象自身的某个属性，不可写且不可配置，那么set方法将不起作用。
```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false,
});

const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = 'baz';
  }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz'; // 触发了 set 方法, 但是由于 'foo' 属性不可写,所以 'foo' 属性值不变
proxy.foo // "bar"
```

严格模式下，set 代理必须返回 true, 否则会报错
```js
'use strict';
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
    // 无论有没有下面这一行，都会报错
    return false;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'
```

apply方法拦截函数的调用、call和apply操作。
apply方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。
```js
var target = function () { return 'I am the target'; };
var handler = {
  apply: function () {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);

// 这里的 target 函数被拦截了
p()
// "I am the proxy"
```

```js
var twice = {
    apply(target, ctx, args) {
      // target 就是 sum 函数
      // ctx 是 sum 函数的上下文
      // args 就是传入的参数 [1, 2]
      // Reflect.apply(...arguments) 相当于就是把原函数 sum 调用了一遍
      return Reflect.apply(...arguments) * 2
    }
}

function sum(left, right) {
    return left + right
}
var proxy = new Proxy(sum, twice)
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30

// 直接调用Reflect.apply方法，也会被拦截。
Reflect.apply(proxy, null, [9, 10]) // 38
```

has方法用来拦截HasProperty操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是in运算符。
has方法可以接受两个参数，分别是目标对象、需查询的属性名。
拦截 in 运算符可以查到私有属性
```js
var handler = {
    has (target, key) {
        if (key[0] === '_') {
            return false;
        }
        return key in target;
    }
};

var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```

如果原对象不可配置或者禁止扩展，这时has拦截会报错。
```js
var obj = { a: 10 };
Object.preventExtensions(obj);

var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

'a' in p // TypeError is thrown
```
值得注意的是，has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性。

另外，虽然 for...in 循环也用到了 in 运算符，但是 has 拦截对 for...in 循环不生效。
```js
let stu1 = {name: '张三', score: 59};
let stu2 = {name: '李四', score: 99};

let handler = {
    has(target, prop) {
        if (prop === 'score' && target[prop] < 60) {
            console.log(`${target.name} 不及格`);
            return false;
        }
        return prop in target;
    }
}

let oproxy1 = new Proxy(stu1, handler);
let oproxy2 = new Proxy(stu2, handler);

'score' in oproxy1
// 张三 不及格
// false

'score' in oproxy2
// true

for (let a in oproxy1) {
    console.log(oproxy1[a]);
}
// 张三
// 59

for (let b in oproxy2) {
    console.log(oproxy2[b]);
}
// 李四
// 99
```

construct方法用于拦截new命令，下面是拦截对象的写法。
```js
var handler = {
  construct (target, args, newTarget) {
    return new target(...args);
  }
};
// construct方法可以接受两个参数。
// target：目标对象
// args：构造函数的参数对象
// newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）
var p = new Proxy(function () {}, {
  construct: function(target, args) {
    // args 是参数数组
    console.log('called: ' + args.join(', '));

    // construct方法返回的必须是一个对象，否则会报错。
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10
```

deleteProperty方法用于拦截delete操作
如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
```js
var handler = {
    deleteProperty(target, key) {
        // 验证 delete 的属性名是否是 _ 开头的
        invariant(key, 'delete')
        delete target[key]
        return true
    }
}

function invariant(key, action) {
    if (key[0] === '_') {
        throw new Error(`Invalid attempt to ${action} private "${key}" property`)
    }
}

var target = {_prop: 'foo'}
var proxy = new Proxy(target, handler)
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property
```
注意，目标对象自身的不可配置（configurable）的属性，不能被deleteProperty方法删除，否则报错。

defineProperty方法拦截了Object.defineProperty操作。
```js
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效
```
上面代码中，defineProperty方法返回false，导致添加新属性总是无效。

注意，如果目标对象不可扩展（non-extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置。

getOwnPropertyDescriptor 方法拦截 Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined。
```js
var handler = {
    getOwnPropertyDescriptor (target, key) {
        if (key[0] === '_') {
            return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    }
};
var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);

log(Object.getOwnPropertyDescriptor(proxy, 'wat'))
// undefined
log(Object.getOwnPropertyDescriptor(proxy, '_foo'))
// undefined
log(Object.getOwnPropertyDescriptor(proxy, 'baz'))
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

getPrototypeOf方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。
Object.prototype.__proto__
Object.prototype.isPrototypeOf()
Object.getPrototypeOf()
Reflect.getPrototypeOf()
instanceof
```js
var proto = {};
var p = new Proxy({}, {
    getPrototypeOf(target) {
      // 返回值必须是对象/null
      return proto;
    }
});
log(Object.getPrototypeOf(p) === proto) // true
```

isExtensible方法拦截Object.isExtensible操作。
```js
var p = new Proxy({}, {
  isExtensible: function(target) {
    console.log("called");
    // 注意，该方法只能返回布尔值，否则返回值会被自动转为布尔值。
    return true;
  }
});

Object.isExtensible(p)
// "called"
// true
```
   
ownKeys方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。
Object.getOwnPropertyNames()
Object.getOwnPropertySymbols()
Object.keys()
for...in循环

```js
let target = {
  _bar: 'foo',
  _prop: 'bar',
  prop: 'baz'
};

let handler = {
  ownKeys (target) {
    // 只返回属性的起始字符不是 _ 的 key
    return Reflect.ownKeys(target).filter(key => key[0] !== '_');
  }
};

let proxy = new Proxy(target, handler);
for (let key of Object.keys(proxy)) {
  console.log(target[key]);
}
// "baz"
```

注意, 使用Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回。
目标对象上不存在的属性
属性名为 Symbol 值
不可遍历（enumerable）的属性
```js
let target = {
    a: 1,
    b: 2,
    c: 3,
    [Symbol.for('secret')]: '4',
};

Object.defineProperty(target, 'key', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: 'static'
});

let handler = {
    ownKeys(target) {
        return ['a', 'd', Symbol.for('secret'), 'key'];
    }
};

let proxy = new Proxy(target, handler);

Object.keys(proxy)
// ['a']
```

```js
// 如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys方法返回，否则报错。
var obj = {};
Object.defineProperty(obj, 'a', {
  configurable: false,
  enumerable: true,
  value: 10 }
);

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return ['b'];
  }
});

Object.getOwnPropertyNames(p)
// Uncaught TypeError: 'ownKeys' on proxy: trap result did not include 'a'
```

```js
// 如果目标对象是不可扩展的（non-extensible），这时ownKeys方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。
var obj = {
  a: 1
};

Object.preventExtensions(obj);

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return ['a', 'b'];
  }
});

Object.getOwnPropertyNames(p)
// Uncaught TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
```

preventExtensions方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值。
这个方法有一个限制，只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错。
```js
var proxy = new Proxy({}, {
  preventExtensions: function(target) {
    return true;
  }
});

Object.preventExtensions(proxy)
// Uncaught TypeError: 'preventExtensions' on proxy: trap returned truish but the proxy target is extensible
```
上面代码中，proxy.preventExtensions方法返回true，但这时Object.isExtensible(proxy)会返回true，因此报错。

```js
var proxy = new Proxy({}, {
  preventExtensions: function(target) {
    console.log('called');
    Object.preventExtensions(target);
    return true;
  }
});

Object.preventExtensions(proxy)
// "called"
// Proxy {}
```
喵喵喵???

setPrototypeOf方法主要用来拦截Object.setPrototypeOf方法。
```js
var handler = {
  setPrototypeOf (target, proto) {
    // 只能返回布尔值,否则会报错
    // 另外，如果目标对象不可扩展（non-extensible），setPrototypeOf方法不得改变目标对象的原型。
    throw new Error('Changing the prototype is forbidden');
  }
};
var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);
// Error: Changing the prototype is forbidden
```
上面代码中，只要修改target的原型对象，就会报错。


Proxy.revocable方法返回一个可取消的 Proxy 实例。
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
Proxy.revocable方法返回一个对象
该对象的proxy属性是Proxy实例，revoke属性是一个函数，可以取消Proxy实例。
上面代码中，当执行revoke函数之后，再访问Proxy实例，就会抛出一个错误。

权限相关内容
Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

this 问题
在 Proxy 代理的情况下，目标对象内部的 this 关键字会指向 Proxy 代理。
```js
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false 
// target 里的 this 被改变了,指向了 proxy
proxy.m()  // true
```
一旦 proxy 代理 target.m ，后者内部的 this 就是指向 proxy，而不是 target。

下面是一个例子，由于this指向的变化，导致 Proxy 无法代理目标对象。
```js
const _name = new WeakMap();

class Person {
  constructor(name) {
    // 这里的 this 指向的是 Person
    _name.set(this, name);
  }
  get name() {
    // 这里的 this 指向的是 Person
    return _name.get(this);
  }
}

const jane = new Person('Jane');
jane.name // 'Jane'

const proxy = new Proxy(jane, {});
proxy.name // undefined
```
目标对象jane的name属性，实际保存在外部WeakMap对象_name上面，通过this键区分。
由于通过proxy.name访问时，this指向proxy，导致无法取到值，所以返回undefined。

有些原生对象的内部属性，只有通过正确的this才能拿到，所以 Proxy 也无法代理这些原生对象的属性。
```js
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);

proxy.getDate();
// TypeError: this is not a Date object.
```
上面代码中，getDate方法只能在Date对象实例上面拿到，如果this不是Date对象实例就会报错。这时，this绑定原始对象，就可以解决这个问题。

```js
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // 1
```
(刚才神奇的发现, getDate 和 getData 太特么像了)

Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端。

14. Reflect
主要就是改进 Object 内部的一些方法
（1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。

（2） 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
```js
// 老写法
try {
    Object.defineProperty(target, property, attributes);
    // success
} catch (e) {
    // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
    // success
} else {
    // failure
}
```
（3） 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
```js
// 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```
（4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
```js
Proxy(target, {
  set: function(target, name, value, receiver) {
    // 只要是 proxy 有的, reflect 就能对应默认的方法
    var success = Reflect.set(target,name, value, receiver);
    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  }
});

var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});
```
上面代码中，每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。

Reflect.get(target, name, receiver)
```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

Reflect.get(myObject, 'foo') // 1
Reflect.get(myObject, 'bar') // 2
Reflect.get(myObject, 'baz') // 3

var myObject = {
    foo: 1,
    bar: 2,
    get baz() {
      // 这里的 this 变成了 myReceiverObject
        return this.foo + this.bar;
    },
};

var myReceiverObject = {
    foo: 4,
    bar: 4,
};

// 第三个参数就是重新绑定 this 
log(Reflect.get(myObject, 'baz', myReceiverObject)) // 8
```

Reflect.set(target, name, value, receiver)
```js
var myObject = {
    foo: 1,
    set bar(value) {
        return this.foo = value;
    },
}

log(myObject.foo) // 1

Reflect.set(myObject, 'foo', 2);
log(myObject.foo) // 2
//
Reflect.set(myObject, 'bar', 3)
log(myObject.foo) // 3
```

如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
```js
var myObject = {
    foo: 4,
    set bar(value) {
        // 这边的 this 被修改了, 指向的是 myReceiverObject 
        return this.foo = value;
    },
};

var myReceiverObject = {
    foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
log(myObject.foo) // 4
log(myReceiverObject.foo) // 1
```

如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。
```js
let p = {
    a: 'a'
};

let handler = {
    set(target, key, value, receiver) {
        console.log('set');
        // receiver 指向当前 proxy 实例(即 obj)
        // Reflect.set一旦传入receiver，就会将属性赋值到receiver上面（即obj），导致触发defineProperty拦截。
        // 如果Reflect.set没有传入receiver，那么就不会触发defineProperty拦截。
        Reflect.set(target, key, value, receiver)
    },
    defineProperty(target, key, attribute) {
        console.log('defineProperty');
        Reflect.defineProperty(target, key, attribute);
    }
};

let obj = new Proxy(p, handler);
obj.a = 'A';
// set
// defineProperty
```

Reflect.has(obj, name)
```js
var myObject = {
  foo: 1,
};

// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```

Reflect.deleteProperty(obj, name)
Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。
```js
const myObj = { foo: 'bar' };

// 旧写法
delete myObj.foo;

// 新写法
Reflect.deleteProperty(myObj, 'foo');
```

Reflect.construct(target, args)
Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。
```js
function Greeting(name) {
  this.name = name;
}

// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);
```

Reflect.getPrototypeOf(obj)
Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。
```js
const myObj = new FancyThing();

// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype;

// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype;
```
Reflect.getPrototypeOf和Object.getPrototypeOf的一个区别是，
如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。

Reflect.setPrototypeOf(obj, newProto)
Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。
```js
const myObj = {};

// 旧写法
Object.setPrototypeOf(myObj, Array.prototype);

// 新写法
Reflect.setPrototypeOf(myObj, Array.prototype);

myObj.length // 0
```

Reflect.apply(func, thisArg, args)
Reflect.apply方法等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。

一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作。
```js
const ages = [11, 33, 12, 54, 18, 96];

// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```

Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。
```js
function MyDate() {
  /*…*/
}

// 旧写法
Object.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});

// 新写法
Reflect.defineProperty(MyDate, 'now', {
  value: () => Date.now()
});
```

proxy 拦截, 再用 reflect 处理
```js
const p = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(descriptor);
    return Reflect.defineProperty(target, prop, descriptor);
  }
});

p.foo = 'bar';
// {value: "bar", writable: true, enumerable: true, configurable: true}

p.foo // "bar"
```

Reflect.getOwnPropertyDescriptor(target, propertyKey)

Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。
```js
var myObject = {};
Object.defineProperty(myObject, 'hidden', {
  value: true,
  enumerable: false,
});

// 旧写法
var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden');

// 新写法
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden');
```

Reflect.isExtensible (target)
Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。
```js
const myObject = {};

// 旧写法
Object.isExtensible(myObject) // true

// 新写法
Reflect.isExtensible(myObject) // true
```

Reflect.preventExtensions(target) § ⇧
Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。
```js
var myObject = {};

// 旧写法
Object.preventExtensions(myObject) // Object {}

// 新写法
Reflect.preventExtensions(myObject) // true
```

Reflect.ownKeys (target)
Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
```js
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};

// 旧写法
Object.getOwnPropertyNames(myObject)
// ['foo', 'bar']

Object.getOwnPropertySymbols(myObject)
//[Symbol(baz), Symbol(bing)]

// 新写法
Reflect.ownKeys(myObject)
// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```

实例：使用 Proxy 实现观察者模式 (完全懵逼...跳过)
```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
// 上面代码中，先定义了一个Set集合，所有观察者函数都放进这个集合。然后，observable函数返回原始对象的代理，拦截赋值操作。拦截函数set之中，会自动执行所有观察者。
```

15. Promise
运行顺序问题:
```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```
上面代码中，Promise 新建后立即执行，所以首先输出的是Promise。然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以resolved最后输出。

下面是一个用Promise对象实现的 Ajax 操作的例子。
```js
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```
上面代码中，getJSON是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个Promise对象。需要注意的是，在getJSON内部，resolve函数和reject函数调用时，都带有参数。
如果调用resolve函数和reject函数时带有参数，那么它们的参数会被传递给回调函数。reject函数的参数通常是Error对象的实例，表示抛出的错误；resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例，比如像下面这样。
```js
const p1 = new Promise(function (resolve, reject) {
  // 这里 resolve() 里的参数,会传递给 p1
  // 这里 reject() 抛出的错误,会被 p2.catch 捕获到
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```
注意，这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行。
```js
// 调用resolve或reject并不会终结 Promise 的参数函数的执行。

new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。
一般来说，调用resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，而不应该直接写在resolve或reject的后面。所以，最好在它们前面加上return语句，这样就不会有意外。
```js
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```

Promise.prototype.then()
Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。
它的作用是为 Promise 实例添加状态改变时的回调函数。
then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
then方法返回的是一个新的 Promise 实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。

```js
getJSON("/post/1.json")
  .then(
    post => getJSON(post.commentURL))
  .then(
    // funcA
    comments => console.log("resolved: ", comments),
    // funcB
    err => console.log("rejected: ", err)
  );
```
第一个then方法指定的回调函数，返回的是另一个Promise对象。
这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。如果变为resolved，就调用funcA，如果状态变为rejected，就调用funcB。

Promise.prototype.catch方法是.then(null, rejection)的别名，用于指定发生错误时的回调函数。
```js
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```
getJSON方法返回一个 Promise 对象，如果该对象状态变为resolved，则会调用then方法指定的回调函数；如果异步操作抛出错误，状态就会变为rejected，就会调用catch方法指定的回调函数，处理这个错误。
另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。
```js
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
```

```js
const promise = new Promise(function(resolve, reject) {
  throw new Error('test');
});
promise.catch(function(error) {
  console.log(error);
});
// Error: test
// 上面代码中，promise抛出一个错误，就被catch方法指定的回调函数捕获。注意，上面的写法与下面两种写法是等价的。

// 写法一
const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
});
promise.catch(function(error) {
  console.log(error);
});

// 写法二
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
});
promise.catch(function(error) {
  console.log(error);
});
```
reject 就相当于是抛出错误

如果 Promise 状态已经变成resolved，再抛出错误是无效的。
```js
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  // 下面这句是无效的
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

代码风格问题
```js
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
// 上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）。因此，建议总是使用catch方法，而不使用then方法的第二个参数。
```
Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

```js

const promise = new Promise(function (resolve, reject) {
    resolve('ok');
    setTimeout(function () { 
        throw new Error('test') 
    }, 0)
});

promise.then(function (value) { 
    console.log(value) 
});
// ok
// Uncaught Error: test
```
Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

```js
const someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2)
    })
}

someAsyncThing()
    .catch(function (error) {
        console.log('oh no', error)
    })
    .then(function () {
        console.log('carry on')
    })
// oh no [ReferenceError: x is not defined]
```

finally方法用于指定不管 Promise 对象最后状态如何，都会执行的操作
下面是一个例子，服务器使用 Promise 处理请求，然后使用finally方法关掉服务器。
```js
server.listen(port)
  .then(function () {
    // ...
  })
  .finally(server.stop);
```

```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
// 上面代码中，不管前面的 Promise 是fulfilled还是rejected，都会执行回调函数callback。
// 从上面的实现还可以看到，finally方法总是会返回原来的值。
```

Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。
```js
const p = Promise.all([p1, p2, p3]);
```
p的状态由p1、p2、p3决定，分成两种情况。
（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
// 上面代码中，promises是包含 6 个 Promise 实例的数组，只有这 6 个实例的状态都变成fulfilled，或者其中有一个变为rejected，才会调用Promise.all方法后面的回调函数。
```

```js
const databasePromise = connectDatabase();

const booksPromise = databasePromise
  .then(findAllBooks);

const userPromise = databasePromise
  .then(getCurrentUser);

Promise
  .all([
    booksPromise,
    userPromise
  ])
  .then(
    ([books, user]) => pickTopRecommentations(books, user)
  );
// 上面代码中，booksPromise和userPromise是两个异步操作，只有等到它们的结果都返回了，才会触发pickTopRecommentations这个回调函数。
```

注意: 作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
// 这里 catch 返回的是一个 Promise 实例, p2 指向实际上这个新的 Promise 实例,所以执行完 catch 方法后, 也会变成 resolved
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```
上面代码中，p1会resolved，p2首先会rejected，但是p2有自己的catch方法，该方法返回的是一个新的 Promise 实例，p2指向的实际上是这个实例。
该实例执行完catch方法后，也会变成resolved，导致Promise.all()方法参数里面的两个实例都会resolved，因此会调用then方法指定的回调函数，而不会调用catch方法指定的回调函数。

如果p2没有自己的catch方法，就会调用Promise.all()的catch方法。
```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错了
```

Promise.try
想用 promise 处理一个函数(可能是同步,也可能是异步)
```js
Promise.resolve().then(f)
```
上面的写法有一个缺点，就是如果f是同步函数，那么它会在本轮事件循环的末尾执行。
```js
const f = () => console.log('now');
Promise.resolve().then(f);
console.log('next');
// next
// now
```
上面代码中，函数f是同步的，但是用 Promise 包装了以后，就变成异步执行了。

目标: 让同步函数同步执行，异步函数异步执行，并且让它们具有统一的 API 
```js
// 第一种解决方案 async
const f = () => console.log('now');
(async () => f())();
console.log('next');
// now
// next

// 如果 f 是异步的
(async () => f())()
.then(...)
.catch(...)
```

```js
// 第二种写法是使用new Promise()。
const f = () => console.log('now');
(
  () => new Promise(
    resolve => resolve(f())
  )
)();
console.log('next'); 
// now
// next
```

未来可用 promise.try
统一用promise.catch()捕获所有同步和异步的错误。
```js
Promise.try(database.users.get({id: userId}))
  .then(...)
  .catch(...)
```

16. Iterator 和 for-of 循环
遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。
作用有三个：
一是为各种数据结构，提供一个统一的、简便的访问接口；
二是使得数据结构的成员能够按某种次序排列；
三是 ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费。

Iterator 的遍历过程
创建一个指针对象,指向当前数据结构的起始位置(遍历器的本质就是一个指针对象)
第一次调用指针对象的 next() 方法,将指针指向数据结构的第一个成员

下面是一个模拟next方法返回值的例子。
```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
};
```
上面代码中，对象obj是可遍历的（iterable），因为具有Symbol.iterator属性。执行这个属性，会返回一个遍历器对象。该对象的根本特征就是具有next方法。每次调用next方法，都会返回一个代表当前成员的信息对象，具有value和done两个属性。

原生具备 Iterator 接口的数据结构如下。
Array
Map
Set
String
TypedArray
函数的 arguments 对象
NodeList 对象
对于原生部署 Iterator 接口的数据结构，不用自己写遍历器生成函数，for...of循环会自动遍历它们。

数组的 iterator
```js
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

log(iter.next()) // { value: 'a', done: false }
log(iter.next()) // { value: 'b', done: false }
log(iter.next()) // { value: 'c', done: false }
log(iter.next()) // { value: undefined, done: true }
```


```js
class RangeIterator {
    constructor(start, stop) {
        this.value = start
        this.stop = stop
    }
    // Symbol.iterator属性对应一个函数，执行后返回当前对象的遍历器对象。
    [Symbol.iterator]() {
        return this
    }
    next() {
        var value = this.value
        if(value < this.stop) {
            this.value++
            return {done: false, value: value}
        }else {
            return {done: true, value: undefined}
        }
    }
}

var range = function (start, stop) {
    return new RangeIterator(start, stop)
}

for (var value of range(0, 3)) {
    console.log(value); // 0, 1, 2
}
```

通过遍历器实现指针结构
在构造函数的原型链上部署Symbol.iterator方法，调用该方法会返回遍历器对象iterator，调用该对象的next方法，在返回一个值的同时，自动将内部指针移到下一个实例。
```js
const log = console.log.bind(console)

function Obj(value) {
    this.value = value
    this.next = null
}

Obj.prototype[Symbol.iterator] = function () {
    var current = this

    function next() {
        if (current) {
            var value = current.value
            current = current.next
            return {done: false, value: value}
        } else {
            return {done: true}
        }
    }

    var iterator = {
        next: next
    }
    return iterator
}

var one = new Obj(1)
var two = new Obj(2)
var three = new Obj(3)
one.next = two
two.next = three

for(var i of one) {
    console.log(i)
}
```

给对象添加 iterator 接口
```js
let obj = {
    data: ['hello', 'world'],
    [Symbol.iterator]() {
        const self = this
        var index = 0
        return {
            next() {
                if (index < self.data.length) {
                    return {
                        done: false,
                        value: self.data[index++]
                    }
                } else {
                    return {
                        done: true,
                        value: undefined
                    }
                }
            }
        }
    }
}

for (var i of obj) {
    console.log(i)
}
```

对于类似数组的对象（存在数值键名和length属性），部署 Iterator 接口，有一个简便方法，就是Symbol.iterator方法直接引用数组的 Iterator 接口。
```js
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
```
NodeList 对象是类似数组的对象，本来就具有遍历接口，可以直接遍历。上面代码中，我们将它的遍历接口改成数组的Symbol.iterator属性，可以看到没有任何影响。

直接部署的前提是类数组对象,也就是有下标,有length
```js
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

有了遍历器接口，数据结构就可以用for...of循环遍历（详见下文），也可以使用while循环遍历。
```js
let iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
};
var iterableObject = iterable[Symbol.iterator]()
var returnValue = iterableObject.next()
while (!returnValue.done) {
    console.log(returnValue)
    returnValue = iterableObject.next()
}
```
上面代码中，iterable 代表某种可遍历的数据结构，iterableObject 是它的遍历器对象。
遍历器对象每次移动指针（next方法），都检查一下返回值的 done 属性，如果遍历还没结束，就移动遍历器对象的指针到下一步（next方法），不断循环。

什么时候调用了 iterator 接口呢?
（1）解构赋值
对数组和 Set 结构进行解构赋值时，会默认调用Symbol.iterator方法。
```js
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

（2）扩展运算符
扩展运算符（...）也会调用默认的 Iterator 接口。
```js
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。
```js
let arr = [...iterable];
```

（3）yield*
yield*后面跟的如果是一个可遍历的结构，它会调用该结构的遍历器接口。
```js
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

（4）其他场合
由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。
```js
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
Promise.all()
Promise.race()
```

字符串的 Iterator 接口
```js
// 注意这里必须是字符串对象,不能是直接量,因为直接量上不能修改[Symbol.iterator]
var str = new String("hi");

[...str] // ["h", "i"]

str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (this._first) {
        this._first = false;
        return { value: "bye", done: false };
      } else {
        return { done: true };
      }
    },
    _first: true
  };
};

[...str] // ["bye"]
str // "hi"
```
上面代码中，字符串 str 的Symbol.iterator方法被修改了，所以扩展运算符（...）返回的值变成了bye，而字符串本身还是hi。

Iterator 接口与 Generator 函数
Symbol.iterator方法的最简单实现，还是使用下一章要介绍的 Generator 函数。
```js
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"
```

遍历器对象除了具有next方法，还可以具有return方法和throw方法。
如果你自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。

return方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return方法。
如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。
```js
function readLinesSync(file) {
  return {
    [Symbol.iterator]() {
      return {
        next() {
          return { done: false };
        },
        return() {
          file.close();
          return { done: true };
        }
      };
    },
  };
}
```

一个数据结构只要部署了Symbol.iterator属性，就被视为具有 iterator 接口，就可以用for...of循环遍历它的成员。也就是说，for...of循环内部调用的是数据结构的Symbol.iterator方法。

for...of循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如arguments对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。

```js
var arr = ['a', 'b', 'c', 'd'];

for (let a of arr.entries()) {
    console.log(a); 
    // [ 0, 'a' ]
    // [ 1, 'b' ]
    // [ 2, 'c' ]
    // [ 3, 'd' ]
}

for (let a of arr.keys()) {
    console.log(a); // 0 1 2 3
}

for (let a of arr) { // 等价于 for (let a of arr.values()) {
    console.log(a); // a b c d
}
```

for...of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。
这一点跟for...in循环也不一样。
```js
let arr = [3, 5, 7];
arr.foo = 'hello';

for (let i in arr) {
  console.log(i); // "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); //  "3", "5", "7"
}
```

Set 和 Map 结构也原生具有 Iterator 接口，可以直接使用for...of循环。
```js
var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
  console.log(e);
}
// Gecko
// Trident
// Webkit

var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (var [name, value] of es6) {
  console.log(name + ": " + value);
}
for (var item of es6) {
  console.log(item); // 这里的 item 是一个数组
}
// edition: 6
// committee: TC39
// standard: ECMA-262
```
首先，遍历的顺序是按照各个成员被添加进数据结构的顺序。
其次，Set 结构遍历时，返回的是一个值，
而 Map 结构遍历时，返回的是一个数组，该数组的两个成员分别为当前 Map 成员的键名和键值。

有些数据结构是在现有数据结构的基础上，计算生成的。比如，ES6 的数组、Set、Map 都部署了以下三个方法，调用后都返回遍历器对象。

entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于 Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
keys() 返回一个遍历器对象，用来遍历所有的键名。
values() 返回一个遍历器对象，用来遍历所有的键值。
这三个方法调用后生成的遍历器对象，所遍历的都是计算生成的数据结构。

for...of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。
```js
for (let x of 'a\uD83D\uDC0A') {
  console.log(x);
}
// 'a'
// '\uD83D\uDC0A'
```

```js
并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用Array.from方法将其转为数组。

let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

不能对对象直接使用 for of
```js
let es6 = {
    edition: 6,
    committee: "TC39",
    standard: "ECMA-262"
}
// 一种解决方法是，使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组。
for (let e of Object.keys(es6)) {
    console.log(e)
}
// edition
// committee
// standard

// 另一个方法是使用 Generator 函数将对象重新包装一下。
function* f(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]]
    }
}

for(let e of f(es6)) {
    console.log(e)
    // [ 'edition', 6 ]
    // [ 'committee', 'TC39' ]
    // [ 'standard', 'ECMA-262' ]
}
```

for 循环 
=> 数组的 forEach(不能 break, return 退出) 
=> for-in
数组的键名是数字，但是for...in循环是以字符串作为键名“0”、“1”、“2”等等。
for...in循环不仅遍历数字键名，还会遍历手动添加的其他键，甚至包括原型链上的键。
某些情况下，for...in循环会以任意顺序遍历键名。
总之，for...in循环主要是为遍历对象而设计的，不适用于遍历数组。
=> for-of(最好使用这个)
有着同for...in一样的简洁语法，但是没有for...in那些缺点。
不同于forEach方法，它可以与break、continue和return配合使用。
提供了遍历所有数据结构的统一操作接口。

17. Generator 函数的语法

Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。
形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
// Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。

// 下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。
// 也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。
// 换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。
hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```
调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。
以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。
value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。

由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

yield 和 return 表达式的共同点和区别
相似之处在于，都能返回紧跟在语句后面的那个表达式的值。
区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆的功能。
一个函数里面，只能执行一次（或者说一个）return语句，但是可以执行多次（或者说多个）yield表达式。
正常函数只能返回一个值，因为只能执行一次return；Generator 函数可以返回一系列的值，因为可以有任意多个yield。

Generator 函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。
```js
function* f() {
  console.log('执行了！')
}

var generator = f(); // 此时 f() 不会执行

setTimeout(function () {
  generator.next() // 2s 后才会输出 '执行了!'
}, 2000);
```
上面代码中，函数f如果是普通函数，在为变量generator赋值时就会执行。但是，函数f是一个 Generator 函数，就变成只有调用next方法时，函数f才会执行。

```js
var arr = [1, [[2, 3], 4], [5, 6]]

// 生成一个迭代器
var flat = function* (a) {
    var length = a.length
    for (var i = 0; i < length; i++) {
        var item = a[i]
        if (Array.isArray(item)) {
            yield* flat(item)
        } else if (typeof item === 'number') {
            yield item
        }
    }
}

for (var f of flat(arr)) {
    console.log(f)
}
// 1, 2, 3, 4, 5, 6
```

另外，yield表达式如果用在另一个表达式之中，必须放在圆括号里面。
```js
function* demo() {
  console.log('Hello' + yield); // SyntaxError
  console.log('Hello' + yield 123); // SyntaxError

  console.log('Hello' + (yield)); // OK
  console.log('Hello' + (yield 123)); // OK
}
```

yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
```js
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

与 iterator 的关系
任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。
```js
var obj = {}

obj[Symbol.iterator] = function* () {
    yield 1
    yield 2
    yield 3
}

console.log([...obj])
```

Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。
```js
function* gen(){
  // some code
}

var g = gen(); 

g[Symbol.iterator]() === g
// true
```
上面代码中，gen是一个 Generator 函数，调用它会生成一个遍历器对象g。它的Symbol.iterator属性，也是一个遍历器对象生成函数，执行后返回它自己。

yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
```js
function* f() {
    for (var i = 0; true; i++) {
        // 如果 g.next() 不传参数,这里的 reset 就是 undefined
        // 如果 g.next() 传入了 true,这里的 reset 就是 true
        var reset = yield i 
        if (reset) {
            i = -1
        }
    }
}

var g = f()
log(g.next())           // {value: 0, done: false}
log(g.next(true))       // {value: 0, done: false}
log(g.next())           // {value: 1, done: false}
```

Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。
通过next方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。
也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。
```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() 
// 这里停在了第一个 yield, 返回了一个对象,其中 value 就是 yield 后面的表达式的值
// Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
// 这里停在了第二个 yield, 返回了一个对象,其中 value 就是 yield 后面的表达式的值(此处 y 是 NaN(2*undefined) )
// Object{value:NaN, done:false}
a.next() 
// 这里停在了第三个 yield, 返回了一个对象,其中 value 就是 return 后面的表达式的值(此处 y 是 NaN, z 是 undefined)
// Object{value:NaN, done:true}

var b = foo(5);
// x = 5
// 5 + 1 = 6
log(b.next())  // { value:6, done:false }
// y = 2 * 12 = 24
// 24 / 3 = 8
log(b.next(12))  // { value:8, done:false }
// z = 13
// x + y + z = 5 + 24 + 13 = 42
log(b.next(13))  // { value:42, done:true }
```
上面代码第一次调用b的next方法时，返回x+1的值6；
第二次调用next方法，将上一次yield表达式的值设为12，因此y等于24，返回y / 3的值8；
第三次调用next方法，将上一次yield表达式的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。

由于next方法的参数表示上一个yield表达式的返回值，所以在第一次使用next方法时，传递参数是无效的。
V8 引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。
从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。

```js
function* dataConsumer() {
    console.log('Started');
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b
```

为了在第一次调用 next 方法的时候,就可以传入参数,需要包一层,提前调用一次 next
```js
function wrapper (generatorFunction) {
  return function(...args) {
    let generatorObject = generatorFunction(...args)
    generatorObject.next()
    return generatorObject
  }
}

const wrapped = wrapper(function* () {
  console.log(`${yield}`)
  return 'done'
})

wrapped().next('第一次传入的参数')
```

for...of循环可以自动遍历 Generator 函数时生成的Iterator对象，且此时不再需要调用next方法。
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```
上面代码使用for...of循环，依次显示 5 个yield表达式的值。
这里需要注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。

利用 generator 函数实现 fibonacci 循环
```js
function * fib () {
  let [prev, curr] = [0, 1]
  for(;;) {
    yield curr; // 注意此要加 ; 
    [prev, curr] = [curr, prev + curr]
  }
}

for(var item of fib()) {
  if(item > 1000) {
    break
  }
  console.log(item)
}
```

利用 generator 函数可以为普通对象添加遍历器接口
```js
// 方法1
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

// 方法2
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };
jane[Symbol.iterator] = objectEntries

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
} 
// first: Jane
// last: Doe
```

Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。
```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```
上面代码中，遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的catch语句捕获。i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。

不要混淆遍历器对象的throw方法和全局的throw命令。上面代码的错误，是用遍历器对象的throw方法抛出的，而不是用throw命令抛出的。后者只能被函数体外的catch语句捕获。
```js
var g = function* () {
  while (true) {
    try {
      yield;
    } catch (e) {
      if (e != 'a') throw e;
      console.log('内部捕获', e);
    }
  }
};

var i = g();
i.next();

try {
  throw new Error('a');
  throw new Error('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 [Error: a]
```
上面代码之所以只捕获了a，是因为函数体外的catch语句块，捕获了抛出的a错误以后，就不会再继续try代码块里面剩余的语句了。

Generator 函数g内部没有部署try...catch代码块，所以抛出的错误直接被外部catch代码块捕获。

如果 Generator 函数内部和外部，都没有部署try...catch代码块，那么程序将报错，直接中断执行。

throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。
```js
function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

var g = gen();
g.throw(1);
// Uncaught 1
```
因为第一次执行next方法，等同于启动执行 Generator 函数的内部代码，否则 Generator 函数还没有开始执行，这时throw方法抛错只可能抛出在函数外部。

throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法。
```js
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b 
g.next() // c
```
g.throw方法被捕获以后，自动执行了一次next方法，所以会打印b。另外，也可以看到，只要 Generator 函数内部部署了try...catch代码块，那么遍历器的throw方法抛出的错误，不影响下一次遍历。

throw命令与g.throw方法是无关的，两者互不影响。
```js
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();

try {
  throw new Error();
} catch (e) {
  g.next();
}
// hello
// world
```
上面代码中，throw命令抛出的错误不会影响到遍历器的状态，所以两次执行next方法，都进行了正确的操作。


Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的catch捕获。
```js
function* foo() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}

var it = foo();

it.next(); // { value:3, done:false }

try {
  it.next(42);
} catch (err) {
  console.log(err);
}
```
上面代码中，第二个next方法向函数体内传入一个参数 42，数值是没有toUpperCase方法的，所以会抛出一个 TypeError 错误，被函数体外的catch捕获。

```js
function* g() {
  yield 1;
  console.log('throwing an exception');
  throw new Error('generator broke!');
  yield 2;
  yield 3;
}

function log(generator) {
  var v;
  console.log('starting generator');
  try {
    v = generator.next();
    console.log('第一次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第二次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第三次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  console.log('caller done');
}

log(g());
// starting generator
// 第一次运行next方法 { value: 1, done: false }
// throwing an exception
// 捕捉错误 { value: 1, done: false }
// 第三次运行next方法 { value: undefined, done: true }
// caller done
```
上面代码一共三次运行next方法，第二次运行的时候会抛出错误，然后第三次运行的时候，Generator 函数就已经结束了，不再执行下去了。

Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。
```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
// 如果return方法调用时，不提供参数，则返回值的value属性为undefined。
// g.return() // { value: undefined, done: true }
g.next()        // { value: undefined, done: true }
```

如果 Generator 函数内部有try...finally代码块，且正在执行try代码块，那么return方法会推迟到finally代码块执行完再执行。
```js
function* numbers () {
  yield 1;
  try {
    yield 2; 
    // 相当于在这里打断了原有的 
    yield 3;
  } finally {
    // 直接跳到了这里
    yield 4;
    yield 5;
    // 这里再跳到 return 的值
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```
上面代码中，调用return方法后，就开始执行finally代码块，然后等到finally代码块执行完，再执行return方法。

next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换yield表达式。

next()是将yield表达式替换成一个值。
```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

throw()是将yield表达式替换成一个throw语句。
```js
gen.throw(new Error('出错了')); 
// Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

return()是将yield表达式替换成一个return语句。
```js
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

yield*表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。
```js
function* foo() {
    yield 'a';
    yield 'b';
}

function* bar() {
    yield 'x';
    yield* foo();
    yield 'y';
}

// // 等同于
// function* bar() {
//     yield 'x';
//     yield 'a';
//     yield 'b';
//     yield 'y';
// }
  
for (let v of bar()){
    console.log(v); 
    // x
    // a
    // b
    // y
}
```

outer1返回一个遍历器对象
outer2返回该遍历器对象的内部值。
```js
function* inner() {
  yield 'hello!';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

var gen = outer1()
gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"

function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}

var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"
```

yield*后面的 Generator 函数（没有return语句时），等同于在 Generator 函数内部，部署一个for...of循环。
```js
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

如果yield*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。
```js
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }
```


任何数据结构只要有 Iterator 接口，就可以被yield*遍历。
```js
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"
```
如果被代理的 Generator 函数有return语句，那么就可以向代理它的 Generator 函数返回数据。
```js
// 被代理的函数
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  // 这里的 v 就是foo() return 的 'foo'
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```
上面代码在第四次调用next方法的时候，屏幕上会有输出，这是因为函数foo的return语句，向函数bar提供了返回值。

```js
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// 值为 [ 'a', 'b' ]
```

上面代码中，存在两次遍历。
第一次是扩展运算符遍历函数logReturned返回的遍历器对象，
第二次是yield*语句遍历函数genFuncWithReturn返回的遍历器对象。
这两次遍历的效果是叠加的，最终表现为扩展运算符遍历函数genFuncWithReturn返回的遍历器对象。
所以，最后的数据表达式得到的值等于[ 'a', 'b' ]。
但是，函数genFuncWithReturn的return语句的返回值The result，会返回给函数logReturned内部的result变量，因此会有终端输出。

yield*命令可以很方便地取出嵌套数组的所有成员。
```js
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e
```

使用yield*语句遍历完全二叉树。
```js
// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']
```

作为对象属性的 Generator 函数 § ⇧
如果一个对象的属性是 Generator 函数，可以简写成下面的形式。
```js
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
```
上面代码中，myGeneratorMethod属性前面有一个星号，表示这个属性是一个 Generator 函数。

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。
```js
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```
上面代码表明，Generator 函数g返回的遍历器obj，是g的实例，而且继承了g.prototype。
但是，如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象。
```js
function* g() {
  this.a = 11;
}

let obj = g(); // obj 此时指向的是遍历器对象,而不是 this(这点和普通的构造函数是不同的)
obj.next();
obj.a // undefined

// 如果是普通构造函数
function normalG () {
  this.a = 11
}
let testObj = new normalG()
testObj.a // 11
```
Generator 函数也不能跟new命令一起用，会报错。

让 Generator 函数返回一个正常的对象实例，既可以用next方法，又可以获得正常的this？

```js
function * F() {
    this.a = 1
    yield this.b = 2
    yield this.c = 3
}

var obj = {}
var f = F.apply(obj) 
// 拿到一个 this 绑定在 obj 上的 generator 对象

console.log(f.next())
console.log(f.next())
console.log(f.next())

// 此时就能调用 this 上存的值了
console.log(obj.a)
console.log(obj.b)
console.log(obj.c)
```

最优雅的解决方案
```js
function * gen() {
    this.a = 1
    yield this.b = 2
    yield this.c = 3
}

function F () {
    return gen.call(gen.prototype)
}

var f = new F()

console.log(f.next())
console.log(f.next())
console.log(f.next())

console.log(f.a)
console.log(f.b)
console.log(f.c)
```

一个状态机
```js
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}

clock()  // tick
clock()  // tock
clock()  // tick
clock()  // tock
```
上面代码的clock函数一共有两种状态（Tick和Tock），每运行一次，就改变一次状态。这个函数如果用 Generator 实现，就是下面这样。
```js
var clock = function* () {
    while(true) {
        console.log('tick');
        yield;
        console.log('tock');
        yield;
    }
}

var c = clock()
c.next() // tick
c.next() // tock
c.next() // tick
c.next() // tock
```
上面的 Generator 实现与 ES5 实现对比，可以看到少了用来保存状态的外部变量ticking，这样就更简洁，更安全（状态不会被非法篡改）、更符合函数式编程的思想，在写法上也更优雅。Generator 之所以可以不用外部变量保存状态，是因为它本身就包含了一个状态信息，即目前是否处于暂停态。

Generator 与协程(没有具体的例子....)
协程（coroutine）是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。
协程既可以用单线程实现(一种特殊的子例程)，也可以用多线程实现(一种特殊的线程)。

协程/子例程
"子例程"（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数.

多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），线程（或函数）之间可以交换执行权。

一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。
这种可以并行执行、交换执行权的线程（或函数），就称为协程。

在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，协程是以多占用内存为代价，实现多任务的并行。

协程/普通线程
协程用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。

不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。
此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。

JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。
这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。

Generator 函数是 ES6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。

上下文
JavaScript 代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象。
然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，由此形成一个上下文环境的堆栈（context stack）

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。

Generator 函数不是这样，它执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。
```js
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(
  g.next().value,
  g.next().value,
);
```
上面代码中，第一次执行g.next()时，Generator 函数gen的上下文会加入堆栈，即开始运行gen内部的代码。等遇到yield 1时，gen上下文退出堆栈，内部状态冻结。第二次执行g.next()时，gen上下文重新加入堆栈，变成当前的上下文，重新恢复执行。

generator 函数的应用
(1)用来处理异步操作
```js
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
// 第一次调用loadUI函数时，该函数不会执行，仅返回一个遍历器。
var loader = loadUI();

// 下一次对该遍历器调用next方法，则会显示Loading界面（showLoadingScreen），并且异步加载数据（loadUIDataAsynchronously）。
// 加载UI
loader.next()

// 等到数据加载完成，再一次使用next方法，则会隐藏Loading界面。
// 卸载UI
loader.next()
```
可以看到，这种写法的好处是所有Loading界面的逻辑，都被封装在一个函数，按部就班非常清晰。

Ajax 是典型的异步操作，通过 Generator 函数部署 Ajax 操作，可以用同步的方式表达。
```js
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    // 这里 next 方法,要传参
    it.next(response);
  });
}

var it = main();
it.next();
```
上面代码的main函数，就是通过 Ajax 操作获取数据。可以看到，除了多了一个yield，它几乎与同步操作的写法完全一样。注意，makeAjaxCall函数中的next方法，必须加上response参数，因为yield表达式，本身是没有值的，总是等于undefined。

下面是另一个例子，通过 Generator 函数逐行读取文本文件。
```js
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}
```
上面代码打开文本文件，使用yield表达式可以手动逐行读取文件。

针对控制流管理这块没看明白... todo

利用for...of循环会自动依次执行yield命令的特性，提供一种更一般的控制流管理的方法。
```js
let steps = [step1Func, step2Func, step3Func];

function* iterateSteps(steps){
  for (var i=0; i< steps.length; i++){
    var step = steps[i];
    yield step();
  }
}
```
上面代码中，数组steps封装了一个任务的多个步骤，Generator 函数iterateSteps则是依次为这些步骤加上yield命令。
```js
let jobs = [job1, job2, job3];

function* iterateJobs(jobs){
  for (var i=0; i< jobs.length; i++){
    var job = jobs[i];
    yield* iterateSteps(job.steps);
  }
}
```
上面代码中，数组jobs封装了一个项目的多个任务，Generator 函数iterateJobs则是依次为这些任务加上yield*命令。

最后，就可以用for...of循环一次性依次执行所有任务的所有步骤。
```js
for (var step of iterateJobs(jobs)){
  console.log(step.id);
}
```
上面的做法只能用于所有步骤都是同步操作的情况，不能有异步操作的步骤。

利用 generator 函数可以在任意对象上部署 iterator 接口
```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

作为数据结构
Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。
```js
function* doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
```
上面代码就是依次返回三个函数，但是由于使用了 Generator 函数，导致可以像处理数组那样，处理这三个返回的函数。
```js
for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}
```
Generator 使得数据或者操作，具备了类似数组的接口。

18. Generator 函数的异步应用

ES6 诞生以前，异步编程的方法，大概有下面四种。
回调函数
事件监听
发布/订阅
Promise 对象

"异步"，简单说就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。

比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件。然后，程序执行其他任务，等到操作系统返回文件，再接着执行任务的第二段（处理文件）。这种不连续的执行，就叫做异步。

相应地，连续的执行就叫做同步。由于是连续执行，不能插入其他任务，所以操作系统从硬盘读取文件的这段时间，程序只能干等着。

传统的回调
```js
var fs = require('fs')

fs.readFile(testest1.js'utf-8', function (err, data) {
  if(err) {
    throw err
  }
  console.log('data', data)
})
```
执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。

传统的回调存在的问题是代码会多重嵌套,出现回调地狱
```js
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  });
});
```
不难想象，如果依次读取两个以上的文件，就会出现多重嵌套。代码不是纵向发展，而是横向发展，很快就会乱成一团，无法管理。因为多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数，可能都要跟着修改。这种情况就称为"回调函数地狱"（callback hell）。

Promise 对象就是为了解决这个问题而提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用。采用 Promise，连续读取多个文件，写法如下。
```js
var readFile = require('fs-readfile-promise');

readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})
.then(function (data) {
  console.log(data.toString());
})
.catch(function (err) {
  console.log(err);
});
```
Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

Promise 的最大问题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚。

传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做"协程"（coroutine），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。

第一步，协程A开始执行。
第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
第三步，（一段时间后）协程B交还执行权。
第四步，协程A恢复执行。
上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

读取文件的协程写法如下。
```js
function* asyncJob() {
  // ...其他代码
  var f = yield readFile(fileA); // 执行到此处,执行权交给其它协程
  // ...其他代码
}
```
上面代码的函数asyncJob是一个协程，它的奥妙就在其中的yield命令。
它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。
它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。Generator 函数的执行方法如下。
```js
function* gen(x) {
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next() // { value: undefined, done: true }
```
上面代码中，调用 Generator 函数，会返回一个内部*指针（即遍历器）g。
这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。
调用指针g的next方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的yield语句，上例是执行到x + 2为止。

next方法的作用是分阶段执行Generator函数。每次调用next方法，会返回一个对象，表示当前阶段的信息（value属性和done属性）。value属性是yield语句后面表达式的值，表示当前阶段的值；done属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。

Generator 函数的数据交换和错误处理

Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

```js
function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
// 数据交换,也就是可以王 generator 里面传值
g.next(2) // { value: 2, done: true }
```

Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。
```js
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw('出错了');
// 出错了
```
上面代码的最后一行，Generator 函数体外，使用指针对象的throw方法抛出的错误，可以被函数体内的try...catch代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

异步任务的封装... 没看懂 todo

求值策略
(1) 传值调用
(2) 传名调用
```js
var x = 1;

function f(m) {
  return m * 2;
}

f(x + 5)
```
上面代码先定义函数f，然后向它传入表达式x + 5。请问，这个表达式应该何时求值？

一种意见是"传值调用"（call by value），即在进入函数体之前，就计算x + 5的值（等于 6），再将这个值传入函数f。C 语言就采用这种策略。比较简单,但是如果计算出的值没有在函数体内用到,就会造成性能损失.
```js
f(x + 5)
// 传值调用时，等同于
f(6)
```

另一种意见是“传名调用”（call by name），即直接将表达式x + 5传入函数体，只在用到它的时候求值。Haskell 语言采用这种策略。
```js
f(x + 5)
// 传名调用时，等同于
(x + 5) * 2
```

Thunk 函数的含义
编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。
```js
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```
上面代码中，函数 f 的参数x + 5被一个函数替换了。凡是用到原参数的地方，对Thunk函数求值即可。
这就是 Thunk 函数的定义，它是“传名调用”的一种实现策略，用来替换某个表达式。

在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
```
上面代码中，fs模块的readFile方法是一个多参数函数，两个参数分别为文件名和回调函数。经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数。这个单参数版本，就叫做 Thunk 函数。

```js
function Thunk(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback)
    }
  }
}

function f(a, callback) {
  callback(a)
}

const ft = Thunk(f)

ft(1)(console.log)
```

升级版 thunk 函数
```js
function thunkify(fn) {
  return function(...args) {
    var ctx = this;

    return function (done) {
      // 通过 called 确保回调函数只执行一次
      var called;
      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
};

function f(a, callback) {
  callback(a)
}
const ft = thunkify(f)
ft(1)(console.log)
```

Thunk 函数现在可以用于 Generator 函数的自动流程管理。

Generator 函数可以自动执行。
```js
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
```
上面代码中，Generator 函数gen会自动执行完所有步骤。

但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，上面的自动执行就不可行。这时，Thunk 函数就能派上用处。

Generator 函数封装了两个异步操作。
```js
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};
```
上面代码中，yield命令用于将程序的执行权移出 Generator 函数，那么就需要一种方法，将执行权再交还给 Generator 函数。

这种方法就是 Thunk 函数，因为它可以在回调函数里，将执行权交还给 Generator 函数。为了便于理解，我们先看如何手动执行上面这个 Generator 函数。
```js
var g = gen();

var r1 = g.next();
r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

Thunk 函数真正的威力，在于可以自动执行 Generator 函数。下面就是一个基于 Thunk 函数的 Generator 执行器。
```js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```
上面代码的run函数，就是一个 Generator 函数的自动执行器。内部的next函数就是 Thunk 的回调函数。next函数先将指针移到 Generator 函数的下一步（gen.next方法），然后判断 Generator 函数是否结束（result.done属性），如果没结束，就将next函数再传入 Thunk 函数（result.value属性），否则就直接退出。

有了这个执行器，执行 Generator 函数方便多了。不管内部有多少个异步操作，直接把 Generator 函数传入run函数即可。当然，前提是每一个异步操作，都要是 Thunk 函数，也就是说，跟在yield命令后面的必须是 Thunk 函数。
```js
var g = function* (){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};

run(g);
```
上面代码中，函数g封装了n个异步的读取文件操作，只要执行run函数，这些操作就会自动完成。这样一来，异步操作不仅可以写得像同步操作，而且一行代码就可以执行。

Thunk 函数并不是 Generator 函数自动执行的唯一方案。因为自动执行的关键是，必须有一种机制，自动控制 Generator 函数的流程，接收和交还程序的执行权。回调函数可以做到这一点，Promise 对象也可以做到

co 模块 § ⇧ 整段垮掉... todo

```js
var fs = require('fs');

var readFile = function (fileName){
    return new Promise(function (resolve, reject){
        fs.readFile(fileName, function(error, data){
            if (error) return reject(error);
            resolve(data);
        });
    });
};

var gen = function* (){
    var f1 = yield readFile('./test1.js');
    var f2 = yield readFile('./test2.js');
    console.log('f1的内容', f1.toString());
    console.log('f2的内容', f2.toString());
};

var co = require('co');
// Generator 函数只要传入co函数，就会自动执行(相当于一直调用 next )。
// co函数返回一个Promise对象，因此可以用then方法添加回调函数。
// 上面代码中，等到 Generator 函数执行结束，就会输出一行提示。
co(gen).then(function (){
    console.log('Generator 函数执行完成');
});
```

```js
var fs = require('fs');

var readFile = function (fileName){
    return new Promise(function (resolve, reject){
        fs.readFile(fileName, function(error, data){
            if (error) return reject(error);
            resolve(data);
        });
    });
};

var gen = function* (){
    var f1 = yield readFile('./test1.js');
    var f2 = yield readFile('./test2.js');
    console.log('f1的内容', f1.toString());
    console.log('f2的内容', f2.toString());
};

var g = gen()

console.log(g) // Object [Generator] {}
console.log(g.next()) // { value: Promise { <pending> }, done: false }

g.next().value.then(function(data) {
  console.log(data.toString()) // 这里就是第一个文件里的字符串
})

// 这样就是手动触发了
g.next().value.then(function(data) {
    console.log('data1', data.toString())
    g.next(data).value.then(function(data) {
        console.log('data2', data.toString())
        g.next(data)
    })
})

// data1 info1
// data2 info2
// f1的内容 info1
// f2的内容 info2
```

```js
var fs = require('fs');

var readFile = function (fileName){
    return new Promise(function (resolve, reject){
        fs.readFile(fileName, function(error, data){
            if (error) return reject(error);
            resolve(data);
        });
    });
};

var gen = function* (){
    var f1 = yield readFile('./test1.js');
    var f2 = yield readFile('./test2.js');
    console.log('f1的内容', f1.toString());
    console.log('f2的内容', f2.toString());
};

// 实现一个自动执行器
function run(gen) {
    var g = gen()

    function next(data) {
        // 注意,第一次进入的时候 data 是 undefined
        var result = g.next(data)
        // { value: Promise { <pending> }, done: false }
        if (result.done) {
            // 完成了
           return result.value
        } else {
            // 未完成
            // result.value 是一个 promise
            result.value.then(function (data) {
                // 递归调用 next
                next(data)
            })
        }
    }

    next()
}

run(gen)
```

todo 缺一篇 co 模块的解析

co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。
这时，要把并发的操作都放在数组或对象里面，跟在yield语句后面。
```js
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);
```

统计某个英文单词出现的频率,利用了 co 模块的并发处理,和 fs模块的 stream 模式读取文件
```js
const co = require('co');
const fs = require('fs');

const stream = fs.createReadStream('./les_miserables.txt');
let valjeanCount = 0;

co(function*() {
  while(true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => stream.once('error', reject))
    ]);
    if (!res) {
      break;
    }
    stream.removeAllListeners('data');
    stream.removeAllListeners('end');
    stream.removeAllListeners('error');
    valjeanCount += (res.toString().match(/valjean/ig) || []).length;
  }
  console.log('count:', valjeanCount); // count: 1120
});
```

19. async 函数
async 函数是什么？一句话，它就是 Generator 函数的语法糖。
```js
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// 上面代码的函数gen可以写成async函数，就是下面这样。
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await，仅此而已。

async函数对 Generator 函数的改进，体现在以下四点。
(1).内置了执行器. 
之前的 generator 函数必须调用 next ,或者配合 co 模块才能实现执行,现在可以直接执行了

```js
function run(f) {
    return new Promise((resolve, reject) => {
        let iterator = f()
        let obj = iterator.next()

        function next() {
            if (obj.done) {
                resolve(obj.value)
            } else {
                obj.value.then(value => {
                    obj = iterator.next(value)
                    next()
                }, reason => {
                    obj = iterator.throw(reason)
                    next()
                })
            }
        }

        next()
    })
}
```

(2).更好的语义 
async表示函数里有异步操作 await 表示紧跟在后面的表达式需要等待结果。
(3).更广的适用性 
co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
(4).返回值是 promise
async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。

进一步说，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖。

```js
function timeout(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// 以下代码效果同上
async function timeout(ms) {
    await new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


async function asyncPrint(value, ms) {
    await timeout(ms);
    console.log(value);
}

console.log('等待1s')
asyncPrint('hello world', 1000);
```
上面代码指定 1 秒以后，输出hello world。

async函数返回一个 Promise 对象。

async函数内部return语句返回的值，会成为then方法回调函数的参数。
```js
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```
上面代码中，函数f内部return命令返回的值，会被then方法回调函数接收到。

