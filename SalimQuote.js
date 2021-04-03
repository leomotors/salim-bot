// * Return array of all quote available
export function getQuote() {
    let plaintxt = ""
    let quoteArray = []
    const request = require("request")

    // * Pull quote from github
    request({
        url:"https://raw.githubusercontent.com/narze/awesome-salim-quotes/main/README.md",
        json:false
    }, (err,response,body) => {
        plaintxt = body
        let txtarray = plaintxt.split(/\r?\n/)
        for (const index in txtarray){
            if (line.startsWith("-")){
                quoteArray.push(line.slice(2))
                console.log("pushed")
            }
        }
        console.log("SalimQuote.js/ getQuote(): Successfully pulled quote data")
        return quoteArray
    })
}
