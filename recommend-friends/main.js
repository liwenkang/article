// 模拟数据如下所示，是一个 Array
var data = [
    ["A", ["B", "X", "Y", "Z"]], // 这个数组表示"A"关注了"B", "X", "Y", "Z" 4 人
    ["B", ["A", "X", "Y"]],
    ["X", ["A", "B"]],
    ["Y", ["A", "B"]],
    ["Z", []]
]

// 获取单向好友信息
var getUnilateralRelations = function (data) {
    /*
    * 函数功能:获取单向好友信息
    *
    * 输入:
    *
    * ["A", ["B", "X", "Y", "Z"]],
    * ["B", ["A", "X", "Y"]],
    * ["X", ["A", "B"]],
    * ["Y", ["A", "B"]],
    * ["Z", []]
    *
    * 输出:
    *
    * ["A-B", "A-X", "A-Y", "A-Z", "B-A", "B-X", "B-Y", "X-A", "X-B", "Y-A", "Y-B"]
    * "-"表示前者关注后者
    *
    */

    var unilateralRelation = []
    var result = data
    for (var i = 0; i < result.length; i++) {
        for (var j = 0; j < result[i][1].length; j++) {
            var str = result[i][0] + "-"
            str += result[i][1][j]
            unilateralRelation.push(str)
        }
    }
    return unilateralRelation
}

// 获取双向好友信息
var getBilateralRelation = function (data) {
    /* 函数功能:获取双向好友信息
    *
    * 输入:
    *
    * ["A-B", "A-X, "A-Y", "A-Z","B-A", "B-X", "B-Y","X-A", "X-B","Y-A", "Y-B"]
    * "-"表示前者关注后者
    *
    * 输出:
    *
    * ["A=B", "A=X", "A=Y", "B=X", "B=Y"]
    * "="表示两者互相关注
    *
    */

    var result = data
    var bilateralRelation = []
    // 将字符反转后,如果能找到一样的,表示互相关注
    for (var i = 0; i < result.length; i++) {
        for (var j = i + 1; j < result.length; j++) {
            if (result[i].split("").reverse().join("") === result[j]) {
                // 说明是相互关注的好友
                bilateralRelation.push(result[i][0] + "=" + result[i][2])
            }
        }
    }
    return bilateralRelation
}

// 获取三人互为好友信息
var getMultipartiteRelation = function (data) {
    /* 函数功能:获取三人互为好友信息
     *
     * 输入:
     *
     * ["A=B", "A=X", "A=Y", "B=X", "B=Y"]
     * "="表示两者互相关注
     *
     * 输出:
     * ["A==B==X", "A==B==Y"]
     * "=="表示三人互相关注
     *
     */

    var result = data
    var multipartiteRelation = []
    // 如果前者相同,查看后者是否是好友
    // 由于 A=B A=X
    // 又有B=X 所以 A==B==X
    for (var i = 0; i < result.length; i++) {
        for (var j = i; j < result.length; j++) {
            if (result[i].slice(0, 1) === result[j].slice(0, 1) && result[i].slice(2) !== result[j].slice(2)) {
                var x = result[i].slice(2) + "=" + result[j].slice(2)
                if (result.includes(x)) {
                    // 筛选一下后两者也建立关系的,也就是代表三者可以连起来了
                    var y = result[i].slice(0, 1) + "==" + result[i].slice(2) + "==" + result[j].slice(2)
                    multipartiteRelation.push(y)
                }
            }
        }
    }
    return multipartiteRelation
}

// 获取俩人同时关注一个人的信息
var getRelation = function (data) {
    /**
     * 函数功能:获取同时关注一个人的信息
     *
     * 输入
     * [
     *   ["A", ["B", "X", "Y", "Z"]],
     *   ["B", ["A", "X", "Y"]],
     *   ["X", ["A", "B"]],
     *   ["Y", ["A", "B"]],
     *   ["Z", []]
     * ]
     *
     * 输出:
     *  后者都关注了前者
     * [
     *    "X => A - B", // A和B都关注了X
     *    "Y => A - B",
     *    "B => A - X",
     *    "B => A - Y",
     *    "A => B - X",
     *    "A => B - Y",
     *    "A => X - Y",
     *    "B => X - Y"
     * ]
     *
     */

    var relation = []
    var information = data
    for (var i = 0; i < information.length - 1; i++) {
        for (var j = i + 1; j < information.length - 1; j++) {
            var length1 = information[i][1].length
            var length2 = information[j][1].length
            for (var m = 0; m < length1; m++) {
                for (var n = 0; n < length2; n++) {
                    if (information[i][1][m] === information[j][1][n]) {
                        var str = information[i][1][m] + ' => ' + information[i][0] + " - " + information[j][0]
                        relation.push(str)
                    }
                }
            }
        }
    }
    return relation
}

// 把两人只同时关注一个人的情况排除
var deleteAlone = function (data) {
    /*
    * 函数功能:把后面两个人只同时关注一个人的情况删掉
    *
    * 输入:
    * 后者都关注了前者
    * [
    *    "X => A - B", // A和B都关注了X
    *    "Y => A - B",
    *    "B => A - X",
    *    "B => A - Y",
    *    "A => B - X",
    *    "A => B - Y",
    *    "A => X - Y",
    *    "B => X - Y"
    * ]
    *
    * 输出:
    * 此时A-B两人既关注X,还关注了Y
    * [
    *   "X => A - B",
    *   "Y => A - B",
    *   "A => X - Y",
    *   "B => X - Y"
    * ]
    */

    var result = data
    // 凡是左侧数据是同一个人，右侧数据不一样的都删掉
    for (var i = 0; i < result.length - 1; i = i + 2) {
        if (result[i].slice(0, 1) === result[i + 1].slice(0, 1) && result[i].slice(-5) !== result[i + 1].slice(-5)) {
            // 删掉这两个数据
            result.splice(i, 2)
            i = i - 2
        }
    }
    return result
}

// 排除掉这俩人已经相互关注的情况
var deleteAlreadyFriends = function (data, originalData) {
    /*
    * 函数功能:排除掉这俩人已经相互关注的情况
    *
    * 输入:
    * 此时A-B两人既关注X,还关注了Y
    * data: [
    *   "X => A - B",
    *   "Y => A - B",
    *   "A => X - Y",
    *   "B => X - Y"
    * ]
    *
    * originalData: [
    *   ["A", ["B", "X", "Y", "Z"]],
    *   ["B", ["A", "X", "Y"]],
    *   ["X", ["A", "B"]],
    *   ["Y", ["A", "B"]],
    *   ["Z", []]
    * ]
    *
    * 输出:
    * [
    *   "X => A - B",
    *   "Y => A - B"
    * ]
    *
    */

    var result = data
    var unilateralRelations = getUnilateralRelations(originalData)
    var bilateralRelation = getBilateralRelation(unilateralRelations)

    // 删掉右侧相同，但左侧已经互相是好友的
    for (var i = 0; i < result.length - 1; i = i + 2) {
        var x = result[i].slice(0, 1) + "=" + result[i + 1].slice(0, 1)
        if (bilateralRelation.includes(x)) {
            // 说明已经相互关注了,删掉
            result.splice(i, 2)
            i = i - 2
        }
    }
    return result
}

// 列出最终系统的推荐
var splitAndReform = function (relation) {
    /*
    * 函数功能:列出系统的推荐
    *
    * 输入:
    * [
    *   "X => A - B",
    *   "Y => A - B"
    * ]
    *
    * 输出:
    *  ["X + Y"]
    *  也就是推荐X和Y成为朋友
    */

    var data = relation
    var array = []
    var resultList = []
    for (var i = 0; i < data.length; i++) {
        var arr = data[i].split(" => ")
        array.push(arr)
    }
    // ["X", "A - B"]
    // ["Y", "A - B"]
    for (var j = 0; j < array.length - 1; j = j + 2) {
        if (array[j][1] === array[j + 1][1]) {
            resultList.push(array[j][0] + " + " + array[j + 1][0])
        }
    }
    return resultList
}

// 主函数
var main = function (data) {
    var relation = getRelation(data)
    var deleteAloneData = deleteAlone(relation)
    var deleteAlreadyFriendsData = deleteAlreadyFriends(deleteAloneData, data)
    var splitAndReformData = splitAndReform(deleteAlreadyFriendsData)
    log("你的输入是:")
    log(data)
    log("你的输出是:")
    log(splitAndReformData)
}

main(data)