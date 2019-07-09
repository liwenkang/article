## ts 入门到放弃

参考[xcatliu](https://github.com/xcatliu/)的[TypeScript 入门教程](https://ts.xcatliu.com/) 

1. ts 可以指定函数参数的数据类型,并在编译为 js 的时候提醒错误

2. 如果要在报错的时候终止 js 文件的生成，可以在 tsconfig.json 中配置 {compilerOptions {noEmitOnError: true}} 即可。

3. ts 可以指定变量的数据类型,并在编译为 js 的时候提醒错误
    
        boolean true
        new Boolean(1) 生成了包装对象,可以添加属性,方法
        Boolean(1)    相当于 !!1
        ts 区分了 boolean 和 Boolean

4. 在 TypeScript 中，可以用 void(只包括 undefined 和 null) 表示没有任何返回值的函数：

    ```typescript
    function alertName(): void {
        alert('My name is Tom');
    }
    ```

5. ts 可以指定函数返回值的类型

6. undefined 类型的变量只能被赋值为 undefined，null 类型的变量只能被赋值为 null

    ```typescript
    let u: undefined = undefined;
    let n: null = null;
    ```

7. undefined 和 null 是所有类型的子类型(也就是说,我们在初始化一个数字,字符串的时候,也可以把他们的值设定为 undefined 和 null)

    ```typescript
    let num: number = undefined;
    ```

8. void 不是一个子类型,无法赋值给其他类型

    ```typescript
    let u: void;
    let num: number = u;
    // index.ts(2,5): error TS2322: Type 'void' is not assignable to type 'number'.
    ```

9. any 就是可以被赋值未任意类型.

        如果变量定义的时候没有赋值,那么之后它就是 any. 
        如果变量在定义的时候赋值了,那么之后就会根据类型推断,保持这个类型.
        一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值.

10. 一个变量在声明的时候,如果有明确的赋值,那么就会触发类型推论(锁定了该变量的类型,可以省点事...)

    ```typescript
    let myFavoriteNumber; // 在这种没有明确赋值的情况下,会直接推断为 any
    myFavoriteNumber = 'seven';
    myFavoriteNumber = 7;
    ```

11. 联合类型,也就是类型是多种类型中的一种.

    在访问属性和方法的时候,会访问不同类型公有的属性和方法(配合类型推断,判断当前这个变量的类型)
    ```typescript
    let myFavoriteNumber: string | number;
    myFavoriteNumber = 'seven';
    console.log(myFavoriteNumber.length); // 5
    myFavoriteNumber = 7;
    console.log(myFavoriteNumber.length); // 编译时报错
    
    // index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
    ```

12. 使用 interface 定义一个对象

    interface 接口,可以用来定义对象的形状(设定必须有的属性,后面根据这个接口生成的对象属性/方法必须符合接口)

    ```typescript
    interface Person {
        readonly name: string; // 只读属性,不能后期赋值
        age: number;
        skill?: string; // 可选属性
    }
    
    let tom: Person = {
        name: 'tom',
        age: 25,
    };
    ```

13. 如果我们希望一个接口允许任意类型的属性,可以使用 [propName: string]: 类型(这里可以制定类型,如果我们不确定随后添加的类型,就用 any)

        一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集, 所以上面的 age 也必须是 string

    ```typescript
    interface Person {
        readonly name: string; // 只读属性(注意一定要在第一次给对象赋值的时候,就设置好),不能后期赋值
        age: string;
        [propName: string]: string; // 表示任意类型的属性值都是 string
    }
    
    let tom: Person = {
        name: 'Tom',
        age: '25'
    };
    ```

14. 数组的定义

    类型+[]
    ```typescript
    let fibonacci: number[] = [1, 1, 2, 3, 5];
    let list: any[] = ['Xcat Liu', 25, { website: 'http://xcatliu.com' }];
    ```

    数组泛型
    ```typescript
    let fibonacci: Array<number> = [1, 1, 2, 3, 5];
    ```

    接口
    ```typescript
    interface NumberArray {
        [index: number]: number;
    }
    let fibonacci: NumberArray = [1, 1, 2, 3, 5];
    ```

    类数组,有自己特殊的类型 
    ```typescript
    function sum() {
        let args: IArguments = arguments;
    }
    
    function getNodeList(value) {
        let nodeList: NodeList = value
    }
    
    function getHTMLCollection(value) {
        let htmlCollection: HTMLCollection = value
    }
    ```

15. 函数的定义

    ```typescript
    // 函数声明
    function sum(x: number, y: number): number {
        return x + y;
    }
    sum(1, 2);
    
    ```
    
    ```typescript
    // 函数表达式
    let mySum1 = (x: number, y: number): number => x + y;
    
    // 如果需要我们手动给 mySum2 添加类型，则应该是这样(感觉完全没有必要,暂时想不出需要手动添加类型的情况 todo)
    let mySum2: (x: number, y: number) => number = (x: number, y: number): number => x + y;
    // 注意第一个 => 表示的是函数的定义,左边是输入类型,右边是输出类型
    // 第二个 => 才是箭头函数
    ```
    
    ```typescript
    // 用接口定义
    interface SearchFunc {
        (source: string, subString: string): boolean;
    }
    
    let mySearch:SearchFunc = function (source, subString){
        return source.search(subString) !== -1;
    };
    ```

16. 函数的可选参数以及默认值

    ```typescript
    function buildName(firstName: string, lastName?: string) {
        if (lastName) {
            return firstName + ' ' + lastName;
        } else {
            return firstName;
        }
    }
    let tomcat = buildName('Tom', 'Cat');
    let tom = buildName('Tom');
    
    // 函数的可选参数后面不允许再出现必须参数了 (firstName?: string, lastName: string) 不允许
    function buildName(firstName?: string, lastName: string) {
        if (firstName) {
            return firstName + ' ' + lastName;
        } else {
            return lastName;
        }
    }
    let tomcat = buildName('Tom', 'Cat');
    
    // 如果有默认值,则默认推断为可选参数,且不受必须在末尾的影响
    function buildName(firstName: string = 'Tom', lastName: string) {
        return firstName + ' ' + lastName;
    }
    let tomcat = buildName('Tom', 'Cat');
    let cat = buildName(undefined, 'Cat');
    ```

17. 剩余参数 ...

    ```typescript
    function push(array, ...items: number[]) {
        items.forEach((item) => {
            array.push(item);
        });
    }
    
    let a = [];
    push(a, 1, 2, 3);
    ```

18. 利用重载,在函数接受不同数量/类型的参数时,做出不同的处理

        注意: 重载的时候,并不能保证函数的返回结果一定是我们所规定的函数类型,所以在使用重载的时候,可以不设置函数的返回类型(因为并不能做到一对一)[详情](https://github.com/Microsoft/TypeScript/issues/18533)

    ```typescript
    function reverse(x: number): number;
    function reverse(x: string): string;
    function reverse(x: number | string): number | string {
        if (typeof x === 'number') {
            return '1'
        } else if (typeof x === 'string') {
            return x.split('').reverse().join('');
        }
    }
    
    reverse(1) // 此时 x 是数字 1, 但是 reverse 函数返回了字符串(也就是并没有按照预期)
    
    // 使用重载的时候,其实并不能保证返回类型一定是正确的
    function reverse(x: number): number;
    function reverse(x: string): string;
    function reverse(x: number | string): number | string {
        if (typeof x === 'number') {
            return Number(x.toString().split('').reverse().join(''));
        } else if (typeof x === 'string') {
            return x.split('').reverse().join('');
        }
    }
    ```

19. 类型断言(todo ts-start 里面提供的例子, store 有问题,涉及到类型断言), 断言使得联合类型的值指定为一个具体的类型(必须是联合类型中的),注意是 (<类型>变量) 也就是有()包裹
  
    ```typescript
    function getLength1(something: string | number): number {
        // 报错了,因为只能拿到公有属性和方法
        if (something.length) {
            return something.length;
        } else {
            return something.toString().length;
        }
    }
    
    function getLength2(something: string | number): number {
        if ((<string>something).length) {
            return (<string>something).length;
        } else {
            return (<number>something).toString().length;
        }
    }
    ```

20. 针对声明文件(先用起来...遇到需要手写声明文件的再来看 todo)[declaration-files](https://ts.xcatliu.com/basics/declaration-files)

21. ts 定义了很多内置对象,包括 ECMAScript 中的(Boolean、Error、Date、RegExp), DOM 和 BOM 提供的内置对象(Document、HTMLElement、Event、NodeList), 注意 ts 写 node 是需要额外支持的 yarn add @types/node

22. 给一个类型(可以是已有的类型/自定义类型)起个新名字。(常用于联合类型)

23. 字符串字面量类型(类型别名与字符串字面量类型都是使用 type 进行定义)
    ```typescript
    type EventNames = 'click' | 'scroll' | 'mousemove' | 'dblclick';
    function handleEvent(ele: Element, event: EventNames) {
        // do something
    }
    
    handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
    handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'
    ```
    
24. 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。想不到为啥要用元组...(注意区分元组和数组就行了)

25. 枚举(在 index 和 value 之间建立了双向的映射).枚举项有两种类型: 常数项/计算所得项
    ```typescript
    enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
    
    console.log(Days["Sun"] === 0); // true
    console.log(Days["Mon"] === 1); // true
    console.log(Days["Tue"] === 2); // true
    console.log(Days["Sat"] === 6); // true
    
    // 递增步长为 1
    console.log(Days[0] === "Sun"); // true
    console.log(Days[1] === "Mon"); // true
    console.log(Days[2] === "Tue"); // true
    console.log(Days[6] === "Sat"); // true
    ```
    
        如果你非要给自己找点乐子...,就会造成映射很奇怪...
        
    ```typescript
    enum Days {Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};
    
    console.log(Days["Sun"] === 3); // true
    console.log(Days["Wed"] === 3); // true
    // 开始秀了
    console.log(Days[3] === "Sun"); // false
    console.log(Days[3] === "Wed"); // true
    console.log(Days[3] === Days[3]); // true 
    // 所以,永远不要这么做
    ```

        关于计算枚举啥的...跳过了 todo 

26. 类

        使用 static 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用：
        
    ```js
    class Animal {
        name = 'Jack';
        // 同下
        // constructor() {
        //    this.name: 'jack'
        // }
        
        // 可以设置静态属性 todo 如何区分? 可以直接取到 Animal.age
        // Animal.name 是一个内置值, 为类的名字
        static age = 10
    
        static isAnimal(a) {
            return a instanceof Animal;
        }
    }
    
    let a = new Animal('Jack');
    Animal.isAnimal(a); // true
    a.isAnimal(a); // TypeError: a.isAnimal is not a function
    ```
    
        public(不保护) 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
        private(保护) 修饰的属性或方法是私有的，不能在声明它的类的外部访问
        protected(保护,且在子类中可访问) 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的
        
        todo 抽象类跳过...
        
    ```typescript
    class Animal {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        sayHi(): string {
          return `My name is ${this.name}`;
        }
    }
    
    let a: Animal = new Animal('Jack');
    console.log(a.sayHi()); // My name is Jack
    ```
    
27. 类与接口(不同类之间共有的特性,可以提取为接口)
    防盗门(SecurityDoor)继承自门(Door)
    防盗门(SecurityDoor)和车(Car)都想有报警功能(Alarm)
    ```typescript
    interface Alarm {
        alert();
    }

    // 接口与接口之间可以是继承关系：
    interface LightableAlarm extends Alarm{
        lightOn();
        lightOff();
    }

    class Door {
    }
    
    class SecurityDoor extends Door implements Alarm {
        alert() {
            console.log('SecurityDoor alert');
        }
    }

    // 这里只有方法的定义,具体的实现在类里 
    interface Light {
        lightOn();
        lightOff();
    }

    // 后面可以接很多 interface
    class Car implements Alarm, Light {
        alert() {
            console.log('Car alert');
        }
        lightOn() {
            console.log('Car light on');
        }
        lightOff() {
            console.log('Car light off');
        }
    }
    ```
    
    ```typescript
    // 接口也可以继承类
    class Point {
       x: number;
       y: number;
    }
    
    interface Point3d extends Point {
       z: number;
    }
    
    let point3d: Point3d = {x: 1, y: 2, z: 3};
    ```
    
28. 使用接口,定义一个比较复杂的函数
    ```typescript
    interface Counter {
        (start: number): string;
        interval: number;
        reset(): void;
    }
    
    function getCounter(): Counter {
        let counter = <Counter>function (start: number) { };
        counter.interval = 123;
        counter.reset = function () { };
        return counter;
    }
    
    let c = getCounter();
    c(10);
    c.reset();
    c.interval = 5.0;
    ```
    
29. 泛型

    ```typescript
    // 我们在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了。
    function createArray<T>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    }
    
    createArray<string>(3, 'x'); // ['x', 'x', 'x']

    // 注意T和U的类型都是运行的时候才确定的
    function swap<T, U>(tuple: [T, U]): [U, T] {
        return [tuple[1], tuple[0]];
    }
    
    swap([7, 'seven']); // ['seven', 7]

    // 规定了输入参数(T)的形状(Lengthwise) 
    interface Lengthwise {
        length: number;
    }
    
    function loggingIdentity<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);
        return arg;
    }

    // 如果 T extends U, 意味着 U 上的东西,T 上必须都有, T还可以有自己的东西
    function copyFields<T extends U, U>(target: T, source: U): T {
        for (let id in source) {
            if (Object.prototype.hasOwnProperty.call(source, id)) {
                target[id] = (source as T)[id];
            }
        }
        return target;
    }
    
    let x = { a: 1, b: 2, c: 3, d: 4 };
    
    copyFields(x, { b: 10, d: 20 });

    // 使用接口,结合泛型,定义函数
    interface CreateArrayFunc {
        <T>(length: number, value: T): Array<T>;
    }

    // 效果同上 type CreateArrayFunc = <T>(length: number, value: T) => Array<T>;

    let createArray: CreateArrayFunc = function <T>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    };
    
    createArray(3, 'x'); // ['x', 'x', 'x']

    // 泛型用于类的定义
    class GenericNumber<T> {
        zeroValue: T;
        add: (x: T, y: T) => T;
    }
    
    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function(x, y) { return x + y; };

    // 泛型可以有默认参数
    function createArray<T = string>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    }
    ```
    
30. 声明合并(函数可以合并,接口可以合并,类也可以合并),相同的东西就直接帮你合并了(在不产生歧义的条件下)

31. 开启 eslint 后,心态爆炸!