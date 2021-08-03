// * Function for getting formatted time

export function getFormattedTime(simple = false): string {
    function addZero(num: number) {
        if (num < 10) {
            return `0${num}`
        }
        else {
            return `${num}`
        }
    }
    let d = new Date()
    let year = d.getFullYear()
    let month = addZero(d.getMonth() + 1)
    let day = addZero(d.getDate())
    let hour = addZero(d.getHours())
    let min = addZero(d.getMinutes())
    let sec = addZero(d.getSeconds())
    let formattedDate
    if (simple)
        formattedDate = `${year}${month}${day}${hour}${min}${sec}`
    else
        formattedDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`
    return formattedDate
}
