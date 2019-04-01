## 页面元素相互覆盖的问题?

问题1: 在没有设置任何定位的情况下,覆盖的情况(由远及近)?

    1. 根元素的背景和边框
    2. 未定位的元素(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    3. 定位的元素(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    如果了 flex ,设置 order 会影响排列顺序,从而影响堆叠顺序

问题2: 在有左右浮动的情况下,覆盖的情况(由远及近)?

    1. 根元素的背景和边框
    2. 未定位的块元素(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    3. 浮动元素
    4. 未定位的行内元素(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    5. 定位的元素(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    如果了 flex ,设置 order 会影响排列顺序,从而影响堆叠顺序

问题3: 如果使用了负 margin 使得行内元素重叠,可能会遇到其他情况

    (https://www.w3.org/TR/CSS2/zindex.htmlhttps://www.w3.org/TR/CSS2/zindex.html)

问题4: 如何产生一个堆叠上下文?

    1. 一个元素是 html
    2. 一个元素是定位元素(relative, absolute), 而且设置了 z-index
    3. 一个元素是定位元素(fixed, sticky)
    4. 一个元素有透明度 opacity 小于 1(将会产生新的堆叠上下文,从而使得子元素的堆叠顺序发生改变)
    5. filter
    6. transform
    7. 一个元素是 flex-item, 而且设置了 z-index(非 auto)
    8. perspective
    9. clip-path

问题5: 在一个堆叠上下文中,堆叠顺序为(由远及近):

    1. 根元素(如果有定位的元素有负的 z-index, 它会堆叠在根元素后面)
    2. 定位的元素(以及他们的子元素),带有负的 z-index(小的 z-index 在后面; 大的 z-index 在前面; 相同的 z-index,看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    3. 未定位的元素(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    4. 定位的元素(以及他们的子元素),在设置 z-index 为 auto 时(看元素出现在 html 文件中的顺序,后面的覆盖前面的)
    5. 定位的元素(以及他们的子元素),带有正的 z-index(小的 z-index 在后面; 大的 z-index 在前面; 相同的 z-index,看元素出现在 html 文件中的顺序,后面的覆盖前面的)

问题6: 在有 canvas 的时候,会有什么影响?

            z-index
    canvas -1 0 1 2  <=  人眼

问题7: 先是 flex 确定大的布局,然后是 canvas 画了地图,之后在地图上进行了覆盖图标,此时还有全局的弹窗遮罩?

注意事项: 

    判断,或者说设置一个元素的堆叠顺序,首先要注意的就是他是否在某个堆叠上下文中!!!
    如果你给一个元素设置了很大的 z-index, 但是它依然没有按照预期堆叠在页面上,那么很可能时因为它所在的堆叠上下文限制了它的堆叠位置!!!
    一句话总结: 先看堆叠上下文,再考虑 z-index!

参考:

    1. https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
    2. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
