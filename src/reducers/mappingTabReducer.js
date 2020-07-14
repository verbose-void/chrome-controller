import {
    controllerDefaults, axisDefaults, buttonsDefaults,
    triggersDefaults, keyboardDefaults
} from '../defaultSettings'
import { consoleLog } from '../utils/debuggingFuncs'

export const mappingInitialState = {
    controller: controllerDefaults,
    axis: axisDefaults,
    buttons: buttonsDefaults,
    triggers: triggersDefaults,
    keyboard: keyboardDefaults
}

export const mappingReducer = (state, action) => {
    const {type, payload} = action
    switch (type) {
        // mappings
        case 'setController':
            state = {
                ...state,
                controller: {
                    ...state.controller,
                    activeController: payload
                }
            }
            break
        case 'leftStick':
            state = {
                ...state,
                axis: {
                    ...state.axis,
                    leftStick: payload
                }
            }
            break
        case 'rightStick':
            state = {
                ...state,
                axis: {
                    ...state.axis,
                    rightStick: payload
                }
            }
            break
        // buttons
        case 'dPad': 
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    dPad: payload
                }
            }
            break
        case 'buttonsB0':
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    0: payload
                }
            }
            break
        case 'buttonsB1':
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    1: payload
                }
            }
            break
        case 'buttonsB2':
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    2: payload
                }
            }
            break
        case 'buttonsB3':
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    3: payload
                }
            }
            break
        case 'buttonsB9':
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    9: payload
                }
            }
            break
        case 'buttonsB8':
            state = {
                ...state,
                buttons: {
                    ...state.buttons,
                    8: payload
                }
            }
            break
        // triggers
        case 'triggersB4':
            state = {
                ...state,
                triggers: {
                    ...state.triggers,
                    4: payload
                }
            }
            break
        case 'triggersB6':
            state = {
                ...state,
                triggers: {
                    ...state.triggers,
                    6: payload
                }
            }
            break
        case 'triggersB7':
            state = {
                ...state,
                triggers: {
                    ...state.triggers,
                    7: payload
                }
            }
            break
        case 'triggersB5':
            state = {
                ...state,
                triggers: {
                    ...state.triggers,
                    5: payload
                }
            }
            break
        // keyboard 
        case 'keyboardB0':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    0: payload
                }
            }
            break
        case 'keyboardB1':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    1: payload
                }
            }
            break
        case 'keyboardB2':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    2: payload
                }
            }
            break
        case 'keyboardB3':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    3: payload
                }
            }
            break
        case 'keyboardB8':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    8: payload
                }
            }
            break
        case 'keyboardB9':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    9: payload
                }
            }
            break
        case 'keyboardB4':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    4: payload
                }
            }
            break
        case 'keyboardB5':
            state = {
                ...state,
                keyboard: {
                    ...state.keyboard,
                    5: payload
                }
            }
            break
        default:
            state = state
    }

    return state
}