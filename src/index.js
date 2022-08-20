const strTempl = `
    <div>
        <p>
            <h1>内容1</h1>
            <p>内容2</p>
            <ul>
                <li>A</li>
                <li>B</li>
                <li>C</li>
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
    const tagStartReg = /^\<([a-z]+[1-6]?)\>/
    const tagContentReg = /^([^\<^\n]+)\<\/([a-z]+[1-6]?)\>/
    const tagEndReg = /^\<\/([a-z]+[1-6]?)\>/
    while (tempStr.length) {
        if (tempStr.startsWith(' ')) {
            index++
        } else if (tagStartReg.test(tempStr)) { // 匹配到开始标签
            // console.log('匹配到开始标签')
            const [, tagName] = tempStr.match(tagStartReg)
            stack1.push(tagName)
            stack2.push({ tag: tagName, children: [] })
            index += tagName.length + 2
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
            // console.log(tempStr)
            index++
        }
        tempStr = str.substring(index)
    }
    console.log(stack1, stack2[0])
}

parseStrTempl(strTempl)
