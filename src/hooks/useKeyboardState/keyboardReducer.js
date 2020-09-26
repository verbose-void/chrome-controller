import deriveInputValue from './lib/deriveInputValue';

const keyboardReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'CLICK_ON_KEYBOARD':
			return {
				...state,
				textContent: deriveInputValue(state.textContent, payload.value),
			};
		case 'CLICK_OUTSIDE_KEYBOARD':
			return {
				...state,
				keyboardIsOpen: false,
				activeElement: null,
			};
		case 'ELEMENT_ACTIVATED':
			return {
				...state,
				keyboardIsOpen: true,
				activeElement: payload.target,
				textContent: payload.value,
			};
		default:
			throw new Error('Keyboard event unaccounted for');
	}
};

export default keyboardReducer;
