import { consoleLog } from "../utils/debuggingFuncs"
import * as browserActions from './browserActions'

export default () => {
    const keysToActions = {
        autoCursorSelect: {
            action: () => consoleLog('autoCursorSelect'),
        },
        click: {
            action: () => consoleLog('click'),
            // document.elementFromPoint(x, y).click();
        },
        newTab: {
            action: () => browserActions.newTab(),
        },
        closeTab: {
            action: () => browserActions.closeTab(),
        },
        historyBack: {
            action: () => browserActions.historyBack(),
        },
        historyForward: {
            action: () => browserActions.historyForward(),
        },
        tabLeft: {
            action: () => browserActions.tabLeft(),
        },
        tabRight: {
            action: () => browserActions.tabRight(),
        },
        videoScreenSize: {
            action: () => consoleLog('videoScreenSize'),
        },
        videoPlayPause: {
            action: () => consoleLog('videoPlayPause'),
        },
        videoDisplayTime: {
            action: () => consoleLog('videoDisplayTime'),
        },
        space: {
            action: () => consoleLog('space'),
        },
        backspace: {
            action: () => consoleLog('backspace'),
        },
        enter: {
            action: () => consoleLog('enter'),
        },
        clear: {
            action: () => consoleLog('clear'),
        },
        close: {
            action: () => consoleLog('close'),
        },
        scroll: {
            action: (x, y) => browserActions.scroll(x, y)
        },
        moveCursor: {
            action: (x, y, settings) => browserActions.moveCursor(x, y, settings)
        }
    }

    return ({
        handleJoyStick: ({
            leftStick,
            rightStick,
            settings,
        }) => {
            if (leftStick.isActive) {
                if (leftStick.actionName === 'moveCursor') {
                    keysToActions[leftStick.actionName]
                        .action(leftStick.x, leftStick.y, settings)
                } else {
                    keysToActions[leftStick.actionName]
                        .action(leftStick.x, leftStick.y, settings)
                }
            }

            if (rightStick.isActive) {
                if (rightStick.actionName === 'moveCursor') {
                    keysToActions[rightStick.actionName]
                        .action(rightStick.x, rightStick.y, settings)
                } else {
                    keysToActions[rightStick.actionName]
                        .action(rightStick.x, rightStick.y)
                }
            }
        },
        interpretEventByKey: ({ actionName, index }) => {
            if (!keysToActions[actionName]) return
            keysToActions[actionName].action()
        }
    })
}