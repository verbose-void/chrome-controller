import {
    scrollingDefaults, cursorDefaults, hudDefaults
} from '../defaultSettings'
import { consoleLog } from '../utils/debuggingFuncs'

export const generalInitialState = {
    scrolling: scrollingDefaults,
    cursor: cursorDefaults,
    hud: hudDefaults
}

export const generalReducer = (state, action) => {
    const {type, payload} = action    
    switch (type) {
        // scrolling
        case 'scrollSensitivity':
            state = {
                ...state,
                scrolling: {
                    ...state.scrolling,
                    speed: payload
                }
            }
            break
        case 'scrollSprint':
            state = {
                ...state,
                scrolling: {
                    ...state.scrolling,
                    sprintSpeed: payload
                }
            }
            break
        
        // cursor
        case 'cursorColor':
            state = {
                ...state,
                cursor: {
                    ...state.cursor,
                    color: payload
                }
            }
            break
        case 'cursorRadius':
            state = {
                ...state,
                cursor: {
                    ...state.cursor,
                    radius: payload
                }
            }
            break
        case 'horizontalCursorSpeed':
            state = {
                ...state,
                cursor: {
                    ...state.cursor,
                    horizontalSpeed: payload
                }
            }
            break
        case 'verticalCursorSpeed':
            state = {
                ...state,
                cursor: {
                    ...state.cursor,
                    verticalSpeed: payload
                }
            }
            break
        case 'idleHideTimer':
            state = {
                ...state,
                cursor: {
                    ...state.cursor,
                    idleHideTimer: payload
                }
            }
            break

        // hud
        case 'hudHidden':
            state = {
                ...state,
                hud: {
                    ...state.hud,
                    hidden: payload
                }
            }
            break
        case 'hudHideText':
            state = {
                ...state,
                hud: {
                    ...state.hud,
                    hideText: payload
                }
            }
            break
        case 'hudColor':
            state = {
                ...state,
                hud: {
                    ...state.hud,
                    color: payload
                }
            }
            break
        case 'hudSize':
            state = {
                ...state,
                hud: {
                    ...state.hud,
                    size: payload
                }
            }
            break
        case 'hudPosition':
            state = {
                ...state,
                hud: {
                    ...state.hud,
                    position: payload
                }
            }
            break
        default:
            state = state
    }
    return state


}