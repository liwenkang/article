# leetcode N-sum 的讨论

## 本文选取了 leetcode 中关于计算 sum 的三道经典题目, 讨论了双指针的一般用法, 最后给出了 N-Sum 的一种渣渣解

### [1. Two sum](https://leetcode.com/problems/two-sum/description/)
```
Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:

Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```

    这个问题,很明显...没用到双指针啦...
    在 leetcode 官方的解答中,使用了三种解法
    首先是暴力解(双层 for 循环遍历)
    然后是用空间换时间的解法,先用哈希表存储了所有的值,然后单层循环,查表解决
    最后一种比较巧妙, 在单层循环中,先在哈希表中查找差值,找到即返回,否则把循环值加入哈希表(当然,猛地看上去可读性比较一般...)

```js
// 解法 3
var twoSum = function(nums, target) {
    var myMap = {};
    for(var i = 0; i < nums.length; i++) {
        var complement = target - nums[i]
        if (myMap.hasOwnProperty(complement)) {
            return [myMap[complement],i]
        }
        myMap[nums[i]] = i
    }
}
```

### [2. 3Sum](https://leetcode.com/problems/3sum/description/)

```
Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

Note:

The solution set must not contain duplicate triplets.

Example:

Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```

    从这个问题开始,我们就可以开始玩耍双指针了

```js
var threeSum = function (nums) {
    var result = []

    // 为了确保每一种可能我们都可以遍历到,首先我们要对待处理数组进行从小到大排序,之后,我们两个指针就可以一首一尾,开始移动啦
    nums.sort((a, b) => a - b)

    // 我们在先搞个循环,从小到大遍历数组
    for (var i = 0; i < nums.length; i++) {
        // 此时 i 是循环的指针, j 和 k 就是我们的双指针了,他们一个在开始位置,一个在结束位置.
        var j = i + 1
        var k = nums.length - 1

        // 操作指针的移动, 两个指针在靠近的过程中,不能相交
        while (j < k) {
            // 求出和
            var sum = nums[i] + nums[j] + nums[k]
            
            // 分类讨论
            if (sum < 0) {
                // 如果和小, 说明 b 值应该大一点,也就是 j 指针应该右移
                j++
            } else if (sum > 0) {
                // 如果和大, 说明 c 值应该小一点,也就是 k 指针应该左移
                k--
            } else {
                // 如果符合要求了,加到 result 数组
                result.push([nums[i], nums[j], nums[k]])

                // 为避免重复, b, c 两个值需要避免临近重复的出现
                while (j < k && nums[j] === nums[j + 1]) {
                    j++
                }
                while (j < k && nums[k] === nums[k - 1]) {
                    k--
                }
                j++
                k--
            }
        }

        // num[i] 的值不能出现临近重复
        /* example:
        * Input:
        *     [-1,0,1,2,-1,-4]
        * sort:
        *     [-4,-1,-1,0,1,2]
        * Output:
        *     [[-1,-1,2],[-1,0,1],[-1,0,1]]
        *     这里以 -1 开始的两个值会重复
        * Expected:
        *     [[-1,-1,2],[-1,0,1]]
        */
        while (nums[i] === nums[i + 1]) {
            i++
        }
    }
    return result
}
```

    在这个问题中,比较麻烦的一点就是如何保证没有重复的组合.在上面的解法中,当需要移动指针的时候,通过判断临近两个值是否相等,跳过了重复的解

### [3. 4Sum](https://leetcode.com/problems/4sum/description/)

```
Given an array nums of n integers and an integer target, are there elements a, b, c, and d in nums such that a + b + c + d = target? Find all unique quadruplets in the array which gives the sum of target.

Note:

The solution set must not contain duplicate quadruplets.

Example:

Given array nums = [1, 0, -1, 0, -2, 2], and target = 0.

A solution set is:
[
  [-1,  0, 0, 1],
  [-2, -1, 1, 2],
  [-2,  0, 0, 2]
]
```

    刚开始拿到这道题的我是懵逼的,四个数相加...不如直接四个循环嵌套起来?  O(n^4) 的时间复杂度,以及如何去重都是大麻烦.
    还是乖乖用双指针
    比较符合直觉的做法,我想到的是双层循环里面套双指针,代码如下


```js
var fourSum = function (nums, target) {
    var result = []
    // 排序
    nums = nums.sort((a, b) => a - b)

    for (var i = 0; i < nums.length; i++) {
        for (var j = i + 1; j < nums.length; j++) {
            // m, n 就是双指针了
            var m = j + 1
            var n = nums.length - 1

            // 两个指针逼近的过程和 3sum 是类似的
            while (m < n) {
                var sum = nums[i] + nums[j] + nums[m] + nums[n]
                if (sum < target) {
                    m++
                } else if (sum > target) {
                    n--
                } else {
                    result.push([nums[i], nums[j], nums[m], nums[n]])
                    while (m < n && nums[m] === nums[m + 1]) {
                        m++
                    }
                    while (m < n && nums[n] === nums[n - 1]) {
                        n--
                    }
                    m++
                    n--
                }
            }

            // 同样, nums[j] 每次的值都是新的
            while (nums[j] === nums[j + 1]) {
                ++j
            }
        }
        
        // 同样, nums[j] 每次的值都是新的
        while (nums[i] === nums[i + 1]) {
            ++i
        }
    }
    return result
}
```

    看起来不算是太糟糕,在当前情况下,如果我们需要计算一个 N-sum 我们就要在 n-2 层循环里,嵌套一个双指针...如果 N 是一个很大的值,那么将会是个很麻烦的解法,所以,为什么不试试深度优先搜索呢?

```js
var sumArray = function (array) {
    var sum = 0
    array.forEach(value => {
        sum += value
    })
    return sum
}

var NSum = function (nums, target, n) {
    var result = []
    nums = nums.sort((a, b) => a - b)

    var helper = function (nowArray, curIndex) {
        // 结束条件: 当前数组长度达标后, 看下值够不够,够了就加到结果数组里, 如果不够就扔掉
        if (nowArray.length === n) {
            var sum = sumArray(nowArray)
            if (sum === target) {
                result.push(nowArray)
            }
            return
        }

        for (var i = curIndex; i < nums.length; i++) {
            nowArray.push(nums[i])
            // 如果和大于目标值,而且 nums 从当前位置 curIndex 往后,全是大于 0 的值,也就是说不可能再达到 target 了
            if (sumArray(nowArray) > target && nums[i] > 0) {
                return
            }

            // 注意 nowArray 在进行参数传递的时候,应该是通过深度复制一份,而不是直接传递
            helper(nowArray.slice(), i + 1)
            nowArray.pop()
            
            // 同样, 为了避免相邻重复
            while (nums[i] === nums[i + 1]) {
                ++i
            }
        }
    }

    helper([], 0)
    return result
};
```

    前面这个 N-sum 的解为了传递数组参数,以及函数的递归调用,申请了很多的空间,所以它的空间复杂度相对之前的算法很高,在 threeSum 和 fourSum 中分别测试后,都在超时的边缘疯狂试探...只能说是写起来爽了.
