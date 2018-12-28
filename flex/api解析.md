# flex 布局的 api 解析

css 布局的发展:

    table 一把梭(像 excel 表格一样做网页布局) 
    => position(相对定位,绝对定位) 
    => float(为了解决文字环绕等问题, 在 bootstarp 的栅格系统中也有应用) 
    => flex 
    => grid等新布局模式

这里我们重点介绍的 css3 中引入的 flex ,它是用于排列元素的一种布局方法.

通过给父元素设置 flex(行内元素使用 flex-inline),从而让子元素变成 flex-item

弹性布局中的元素( flex-item )是有伸展和收缩自身的能力的,因为所谓的伸缩性,就是为了让子元素撑满父元素,具体可以使用 css 控制撑满的方式(比如横向怎么撑,纵向怎么撑)

flex 为了解决伸缩的问题,首先引入了主轴(main axis)和交叉轴(cross axis)的概念

在传统的布局方式中,仿照的是平时我们书写的方式,从左往右写,写不下就换行

而在 flex 中, flex-item 会沿着主轴的方向排列,如果需要换行的话,那么就要看 flex-wrap 如何定义换行

那么如何定义主轴和交叉轴的方向呢?
主轴方向:

    flex-direction(影响排列顺序): 
        row(默认值,横向从左到右) 
        row-reverse(横向从右到左)
        column(纵向从上到下)
        column-reverse(纵向从下到上)

交叉轴方向就是与主轴垂直的方向

换行方式:

    flex-wrap(影响排列顺序): 
        nowrap(默认值,不换行)
        wrap(换行,第一行在上面)
        wrap-reverse(换行,第一行在下面);

flex-direction 和 flex-wrap 属性的简写形式

    flex-flow: <flex-direction> || <flex-wrap>; (默认值是 row nowrap)

现在我们可以按照 4 * 3 = 12 种不同的方式排列我们的 flex-item 了

排列好以后,我们还要考虑 flex-item 如何在主轴和交叉轴上对齐的问题
首先在主轴上对齐的时候(注意,只有主轴没有占满的时候,才会有对齐的设置问题!):

    justify-content: 
        flex-start(默认值,从开始到结束,不留空隙) 
        flex-end(从结束到开始,不留空隙) 
        center(如果主轴上排的下,那就作为整体居中,如果主轴上放不下,那就先排满,换行后剩余的居中) 
        space-between(两端对齐，项目之间的间隔都相等) 
        space-around(每个项目中间的间隔相等，项目之间的间隔比项目与边框的间隔大一倍) 
        space-evenly(项目之间的间隔和项目与边框的间隔都相等);
            也就是说 between 时两边不留间隙，around 时留单份间隙（flex-item 之间时双份间隙），evenly 时留单份间隙（flex-item 之间留单份间隙）

然后在交叉轴上对齐的时候(注意,只有交叉轴没有占满的时候,才会有对齐问题!):

    align-items(可以把它看作是只有一个交叉轴时的 justify-content): 
        flex-start(顶部对齐)
        flex-end(底部对齐)
        center(垂直居中对齐)
        baseline(文字的底线对齐)
        stretch(默认值, 拉伸, 子元素高度为未设置或是 auto 的时候生效,注意此时依然遵守 min-width 和 max-width)

如果有多根轴线在交叉轴上对齐的时候(单根轴线不会起作用):

    align-content(可以把它看作是有多个交叉轴时的 justify-content):
        flex-start(默认值,从开始到结束,不留空隙) 
        flex-end(从结束到开始,不留空隙) 
        center(如果交叉轴上排的下,那就作为整体居中) 
        space-between(两端对齐，项目之间的间隔都相等) 
        space-around(每个项目中间的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍) 

以上属性都是设置在父元素上面的,小结一下
当我们用到 flex 的时候,我们需要给父元素设置的属性包括

```html
<style>
    .parent {
        display: flex | inline-flex;
        flex-direction: row | row-reverse | column | column-reverse;
        flex-wrap: nowrap | wrap | wrap-reverse;
        flex-flow: <flex-direction> || <flex-wrap>;
        justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
        align-items: stretch | flex-start | flex-end | center | baseline;
        align-content: stretch | flex-start | flex-end | center | space-between | space-around;
    }
</style>

<div class="parent">
    <div class="child">1</div>
    <div class="child">2</div>
    <div class="child">3</div>
</div>
```

接下来介绍的是在子元素上的属性

为了控制元素的排列顺序, 在 css 中可以通过改变 order(默认为 0) 控制 flex-item 的出现顺序

能决定元素展示宽度的属性有：flex-grow，flex-shrink，flex-basis，width，min-width

为了控制元素的伸缩,定义了 flex-grow，flex-shrink，flex-basis

flex-grow 

    定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
    如果所有的 flex-item 的 flex-grow 都设置为 1,那么表示大家平分剩余空间(也就是大家共同变大了)
    如果有人的 flex-grow 是别人的两倍,那么意味着它分配到的剩余空间是别人的两倍
    如果有人的 flex-grow 是 1,但是别人的 flex-grow 为 0(也就是不参与剩余空间的分配),那么前者将占据所有剩余空间
    注意此处不能是负值

flex-shrink 

    定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
    如果所有 flex-item 的 flex-shrink 属性都为1，当空间不足时，都将等比例缩小。
    如果一个 flex-item 的 flex-shrink 属性为0，其他项目都为1，则空间不足时，前者不缩小。
    注意此处不能是负值

flex-basis

    定义了在分配多余空间之前，flex-item 占据的主轴空间（main size）。
    浏览器根据这个属性，计算主轴是否有多余空间。
    它的默认值为 auto，即项目的本来大小。
    flex-basis 为像素值时，初始宽度为 flex-basis 的值。
    flex-basis 为百分比时，初始宽度为占父容器的比例。
    flex-basis 为 0 或 0% 时，初始宽度为 0。(但是不会像 width 为 0 的时候一样真的没有宽度,而是被元素里的内容撑出宽度)
    flex-basis 的优先级大于 width，但是最后计算的展示尺寸受限于 min-width 或者 max-width。

flex 

    flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ] 是前面三个属性的缩写
    默认是 0 1 auto 也就是不主动占据剩余空间,但是空间不够的时候, flex-item 被动等比例变小
    auto (1 1 auto) 主动占据剩余空间,空间不够的时候被动等比例缩小
    none (0 0 auto) 既不主动放大,也不被动缩小
    建议使用缩写属性,从而让浏览器自动推算其他值

align-self

    允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。
    auto(默认值表示继承父元素的align-items属性，如果没有父元素，则等同于stretch)
    flex-start(顶部对齐)
    flex-end(底部对齐)
    center(垂直居中对齐)
    baseline(文字的底线对齐)
    stretch(默认值, 拉伸, 子元素高度为未设置或是 auto 的时候生效,注意此时依然遵守 min-width 和 max-width)

小结一下,当我们用到 flex 的时候,最常用的属性如下所示

```html
<style>
    .parent {
        display: flex | inline-flex;
        flex-direction: row | row-reverse | column | column-reverse;
        flex-wrap: nowrap | wrap | wrap-reverse;
        flex-flow: <flex-direction> || <flex-wrap>;
        justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
        align-items: stretch | flex-start | flex-end | center | baseline;
        align-content: stretch | flex-start | flex-end | center | space-between | space-around;
    }

    .child {
        /* 注意,对于 flex-item 来说 float, clear, vertical-align 都会失效 */
        order: <integer>; /* default 0 */
        flex-grow: <number>; /* default 0 */
        flex-shrink: <number>; /* default 1 */
        flex-basis: <length> | auto; /* default auto */
        flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]; /* default 0 1 auto */
        align-self: auto | flex-start | flex-end | center | baseline | stretch; /* 默认是 auto 继承自父元素,如果没有就是 stretch */
    }
</style>

<div class="parent">
    <div class="child">1</div>
    <div class="child">2</div>
    <div class="child">3</div>
</div>
```

参考 
1. [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
2. [Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
3. [Flex布局原理介绍](https://alisec-ued.github.io/2017/01/03/Flex%E5%B8%83%E5%B1%80%E5%8E%9F%E7%90%86%E4%BB%8B%E7%BB%8D/)
4. [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background)
4. [Flexbox Playground](https://demos.scotch.io/visual-guide-to-css3-flexbox-flexbox-playground/demos/)