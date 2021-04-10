const fs = require("fs")

let words = require("../assets/json/morequotes.json");

fs.readFile("./utils/train.txt", 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    let pending = data.split("\n")
    pending.pop()
    for (let word of pending) {
        words.วาทกรรมสลิ่ม.push(word)
    }
    fs.writeFile(`./assets/json/morequotes.json`, JSON.stringify(words), (err) => {
        if (err)
            console.log(`[JSON ERROR] Error on writing json: ${err}`)
    })
})