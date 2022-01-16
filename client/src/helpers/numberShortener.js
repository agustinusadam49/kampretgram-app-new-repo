const numberShortener = (num) => {
    let stringNum = String(num);
    if (stringNum.length > 3 && stringNum.length < 7) {
        let temp = [];
        for (let i = 1; i < stringNum.length + 1; i++) {
            let huruf = stringNum[stringNum.length - i];
            temp.push(huruf);
        }

        let temp_2 = [];
        for (let j = 1; j < temp.length + 1; j++) {
            if (j > 2) {
                temp_2.push(temp[j]);
            }
        }

        temp_2.pop();
        temp_2.reverse();

        let result = temp_2.join("");
        let modifiedResult = result + "K";

        return modifiedResult;
    } else if (stringNum.length > 6) {
        let temp = [];
        for (let i = 1; i < stringNum.length + 1; i++) {
            let huruf = stringNum[stringNum.length - i];
            temp.push(huruf);
        }

        let temp_2 = [];
        for (let j = 1; j < temp.length + 1; j++) {
            if (j > 5) {
                temp_2.push(temp[j]);
            }
        }

        temp_2.pop();
        temp_2.reverse();

        let result = temp_2.join("");
        let modifiedResult = result + "M";

        return modifiedResult;
    } else if (stringNum.length < 4) {
        return stringNum;
    }
}

export default numberShortener;
