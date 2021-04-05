// * Function for getting formatted time

function getFormattedTime() {
    function addZero(num) {
        if (num < 10) {
            return `0${num}`
        }
        else {
            return `${num}`
        }
    }
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let hour = d.getHours()
    let min = d.getMinutes()
    let sec = d.getSeconds()
    let formattedDate = `${year}-${addZero(month)}-${addZero(day)} ${addZero(hour)}:${addZero(min)}:${addZero(sec)}`
    return formattedDate
}

module.exports = getFormattedTime