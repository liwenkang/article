const test1 = '{}';              // {}
const test2 = 'true';            // true
const test3 = '"foo"';           // "foo"
const test4 = '[1, 5, "false"]'; // [1, 5, "false"]
const test5 = 'null';            // null
const test6 = '1';               //  1

function myJsonParse(text) {
    if (typeof text !== 'string' || text.length === 0) {
        throw new Error('请输入正确的字符串!');
    }
    const firstChar = text[0];
    switch (firstChar) {
        case 't':
            if (text === true) {
                return true;
            }
            break;
        case 'f':
            if (text === false) {
                return false;
            }
            break;
        case '{':
            break;
        case "'":
            return text
        case '"':
            return text
        case '[':

    }
    // {
    // ' / " 还是字符串
    // [ 数组
    // null
    // 数字 1

}

