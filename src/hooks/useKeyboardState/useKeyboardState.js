import { useEffect, useReducer } from 'react';
import keyboardReducer from './keyboardReducer';
import moveCursorToEnd from './utils/moveCursorToEnd';

const useKeyboardState = () => {
	const initialKeyboardState = {
		keyboardIsOpen:
			!!document.activeElement &&
			['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName),
		activeElement: document.activeElement || null,
		textContent:
			document.activeElement &&
			['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
				? document.activeElement.value
				: '',
	};

	const [keyboardState, dispatchKeyboardEvent] = useReducer(
		keyboardReducer,
		initialKeyboardState
	);

	useEffect(() => {
		const { activeElement } = keyboardState;
		if (activeElement && document.readyState === 'complete') {
			activeElement.value = keyboardState.textContent;
		}
	}, [keyboardState.textContent]);

	useEffect(() => {
		const elsToListenTo = ['textarea', 'input'];
		elsToListenTo.forEach(el => {
			document.querySelectorAll(el).forEach(element => {
				element.addEventListener('focus', e => {
					moveCursorToEnd(e.target);
					dispatchKeyboardEvent({
						type: 'ELEMENT_ACTIVATED',
						payload: {
							target: e.target,
							value: e.target.value || '',
						},
					});
				});
			});
		});

		return () =>
			elsToListenTo.forEach(el => {
				document.querySelectorAll(el).forEach(element => {
					element.removeEventListener('focus', e => {
						dispatchKeyboardEvent({
							type: 'ELEMENT_ACTIVATED',
							payload: {
								element: e.target,
							},
						});
					});
				});
			});
	}, []);

	return [keyboardState, dispatchKeyboardEvent];
};

export default useKeyboardState;
