const numberPad = (n, width) => {
    n = Math.floor(n) + "";
    return n.length >= width
        ? n
        : new Array(width - n.length + 1).join("0") + n;
};

const settingDuration = (duration) => {
    const processDuration =
        numberPad(duration / 3600, 2) +
        ":" +
        numberPad((duration % 3600) / 60, 2) +
        ":" +
        numberPad(duration % 60, 2);

    return processDuration;
};

export { numberPad, settingDuration };