export const popupInitialState = {
    modalIsVisible: false
}

export const popupReducer = (state, action) => {
    const {type, payload} = action
    switch (type) {
        case "modalIsVisible":
            state = {
                ...state,
                modalIsVisible: payload
            }
            break
        default:
            state = state
    }

    return state
}