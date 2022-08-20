const strTempl = `
    <div class="box parent" key="1" disabled>
        <p>
            <h1>内容1</h1>
            <p>内容2</p>
            <ul>
                <li key="A">A</li>
                <li key="B">B</li>
                <li key="C">C</li>
            </ul>
        </p>
    </div>
`
const parseStrTempl = str => {
    let index = 0
    let tempStr = str
    // let contentStartIdx = 0
    // stack1存放标签，stack2存放子节点
    const [stack1, stack2] = [[], []]
    const tagStartReg = /^\<([a-z]+[1-6]?)([^\<]*)\>/
    const tagContentReg = /^([^\<^\n]+)\<\/([a-z]+[1-6]?)\>/
    const tagEndReg = /^\<\/([a-z]+[1-6]?)\>/
    while (tempStr.length) {
        if (tempStr.startsWith(' ')) {
            index++
        } else if (tagStartReg.test(tempStr)) { // 匹配到开始标签
            const [, tagName, attrsStr] = tempStr.match(tagStartReg)
            const attrs = parseAttrs(attrsStr)
            console.log('匹配到开始标签', tagName, attrs)
            stack1.push(tagName)
            stack2.push({ tagName, attrs, children: [] })
            index += tagName.length + attrsStr.length + 2
            // contentStartIdx = index
        } else if (tagEndReg.test(tempStr)) {
            // console.log('匹配到结束标签')
            const [, tagEndName] = tempStr.match(tagEndReg)
            const tagStartName = stack1.pop()
            if (tagStartName !== tagEndName) return console.log(`找不到${tagEndName}对应的标签!`)
            if (stack2.length > 1) {
                const obj = stack2.pop()
                // contentStartIdx && obj.children.push({ text: str.substring(contentStartIdx, index) })
                // contentStartIdx = 0
                stack2[stack2.length - 1].children.push(obj)
            }
            index += tagEndName.length + 3
        } else if (tagContentReg.test(tempStr)) { // 匹配到内容
            const [, text] = tempStr.match(tagContentReg)
            console.log('匹配到内容', text)
            stack2[stack2.length - 1].children.push({ text, type: 3 })
            index += text.length
        } else {
            console.log('没匹配到')
            index++
        }
        tempStr = str.substring(index)
    }
    console.log(stack1, stack2[0])
}

function parseAttrs (attrs) {
    // class="box parent" key="1"
    const trimedAttrs = attrs.trim()
    if (!trimedAttrs) return []
    let [startIdx, idx, isInQuote, arr] = [0, 0, false, []]
    const generateAttrObj = () => {
        if (startIdx >= idx) return
        const [key, val] = trimedAttrs.substring(startIdx, idx).split('=')
        arr.push({
            name: key,
            value: val === void 0 ? true : val // 单属性(disabled这种)时默认赋值为true
        })
    }
    while (idx < trimedAttrs.length) {
        if (trimedAttrs[idx] === '"') {
            isInQuote = !isInQuote
        } else if (trimedAttrs[idx] === ' ') {
            if (!isInQuote) {
                generateAttrObj()
                startIdx = idx + 1
            }
        }
        idx++
    }
    generateAttrObj()
    return arr
}

parseStrTempl(strTempl)
