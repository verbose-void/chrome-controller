const parseJoyStickSpeed = (x, y) => {
    const multiplier = 100
    const { xCoord, yCoord } = {
        xCoord: x.coord,
        yCoord: Math.abs(y.coord) * multiplier
    }

    return {
        top: y.coord > 0
            ? yCoord
            : yCoord * -1,
        left: x.coord > 0
            ? xCoord
            : xCoord * -1
    }
}

export { parseJoyStickSpeed } 