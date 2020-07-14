/*
    * ! Button mapping keys:
    * @param B0:
        *   PS4 = X
        *   XBOX = A
    * @param B1: 
        *   PS4 = O
        *   XBOX = B
    * @param B2: 
        *   PS4 = square
        *   XBOX = X
    * @param B3:
        *   PS4 = triangle
        *   XBOX = Y
    * @param B4:
        *   PS4 = L1
    * @param B5: 
        *   PS4 = R1
    * @param B6:
        *   PS4 = L2
    * @param B7:
        *   PS4 = R2
    * @param B8:
        *   PS4 = B8
    * @param B9:
        *   PS4 = options
    * @param B10: 
        *   PS4 = L3
    * @param B11:
        *   PS4 = R3
    * @param B12:
        *   PS4 = dpad up
    * @param B13:
        *   PS4 = dpad down
    * @param B14:
        *   PS4 = dpad left
    * @param B15:
        *   PS4 = dpad right
    * @param B16:
        *   PS4 = PS button
    * @param B17:
        *   PS4 = menu
        
    * @param AXIS 0: left stick X-axis
    * @param AXIS 1: left stick Y-axis
     
    * @param AXIS 0: right stick X-axis
    * @param AXIS 1: right stick Y-axis
    
    
*/

export const scrollingDefaults = {
    speed: 13,
    sprintSpeed: 2.5
}
export const cursorDefaults = {
    color: "#000000",
    radius: 10,
    horizontalSpeed: 5.0,
    verticalSpeed: 5.0,
    idleHideTimer: 5000,
}
export const hudDefaults = {
    hidden: true,
    hideText: false,
    color: "#000000",
    size: 64,
    position: "top"
}

export const controllerDefaults = {
    activeController: "xbox"
}
export const axisDefaults = {
    leftStick: "moveCursor",
    rightStick: "scroll"
}

export const buttonsDefaults = {
    dPad: "autoCursorSelect",
    0: "click",
    1: "videoScreenSize",
    2: "videoPlayPause",
    3: "videoDisplayTime",
    9: "newTab",
    8: "closeTab",
}
export const triggersDefaults = {
    4: "historyBack",
    6: "tabLeft",
    7: "tabRight",
    5: "historyForward",
}

export const keyboardDefaults = {
    0: "none",
    1: "close",
    2: "backspace",
    3: "space",
    8: "clear",
    9: "enter",
    4: "none",
    5: "none",
}

