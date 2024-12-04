const getSlopeOfLine = (line) => {
    const xDis = line[0][2] - line[0][0];
    if (xDis === 0) {
        return null;
    }
    return (line[0][3] - line[0][1]) / xDis
}

const getDistanceSqOfLine = (line) => ((line[0][3] - line[0][1]) ** 2 + (line[0][2] - line[0][0]) ** 2)

const distBetLines = (a, b) => {
    const slopeA = getSlopeOfLine(a)
    const slopeB = getSlopeOfLine(b)
    const c1 = -slopeA * a[0][0] + a[0][1]
    const c2 = -slopeB * b[0][0] + b[0][1]
    const dist = Math.abs(c1 - c2) / ((1 + slopeA ** 2) ** 0.5)
    if (dist > 100 && Math.abs(a[0][1] - a[0][3]) < 20 && Math.abs(b[0][1] - b[0][3]) < 20)
        return true
    else
        return false
}

const checkLineColor = (img, a, b) => {
    const imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if ((imgGray[a[0][1], a[0][0]] >= 0 && imgGray[a[0][1], a[0][0]]) <= 10 && (imgGray[a[0][3], a[0][2]] >= 0 && imgGray[a[0][3], a[0][2]] <= 10)) {
        if ((imgGray[b[0][1], b[0][0]] >= 0 && imgGray[b[0][1], b[0][0]]) <= 10 && (imgGray[b[0][3], b[0][2]] >= 0 && imgGray[b[0][3], b[0][2]] <= 10))
            return true
    }
    return false;
}