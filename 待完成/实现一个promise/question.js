var arr = [[[[[]]]], [[[[]]]], [[[[{id: '0'}]]]], [[[[]]]]]

function getId(array) {
    var answer

    function helper(arr) {
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] === 'object' && !Array.isArray(arr[i])) {
                answer = arr[i].id
                return answer
            } else if (Array.isArray(arr[i])) {
                helper(arr[i])
            }
        }
    }

    helper(array)
    return answer
}

function getId(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'object' && !Array.isArray(arr[i])) {
            return arr[i]
        } else if (Array.isArray(arr[i])) {
            return getId(arr[i])
        }
    }
}

console.log(getId(arr))
