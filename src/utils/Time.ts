// * Time.ts : Take care of formatting time

function _addZero(num: number) {
    if (num < 10) {
        return `0${num}`;
    }
    else {
        return `${num}`;
    }
}

export function getFormattedTime(simple = false): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = _addZero(d.getMonth() + 1);
    const day = _addZero(d.getDate());
    const hour = _addZero(d.getHours());
    const min = _addZero(d.getMinutes());
    const sec = _addZero(d.getSeconds());

    let formattedDate: string;
    if (simple)
        formattedDate = `${year}${month}${day}${hour}${min}${sec}`;
    else
        formattedDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    return formattedDate;
}
