export const parseUID = (e) => {
    const {gamepad} = e
    return `${gamepad.timestamp}_${gamepad.id.split(" ").join("_")}`
}