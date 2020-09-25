import { useEffect, useState } from 'react';

const useKeyboardState = () => {
	const [keyboardIsOpen, toggleKeyboardIsOpen] = useState(false);
	const [activeElement, defineActiveElement] = useState(null);

	useEffect(() => {
		const elsToListenTo = ['textarea', 'input'];
		elsToListenTo.forEach(el => {
			document.querySelectorAll(el).forEach(element => {
				element.addEventListener('focus', e => {
					toggleKeyboardIsOpen(true);
					defineActiveElement(document.activeElement);
				});
				element.addEventListener('blur', e => {
					toggleKeyboardIsOpen(false);
					defineActiveElement(null);
				});
			});
		});

		return () => {
			elsToListenTo.forEach(el => {
				element.classList.add('remove');
				document.querySelectorAll(el).forEach(element => {
					element.removeEventListener('focus', e => {
						toggleKeyboardIsOpen(true);
						defineActiveElement(document.activeElement);
					});
					element.removeEventListener('blur', e => {
						toggleKeyboardIsOpen(false);
						defineActiveElement(null);
					});
				});
			});
		};
	}, [toggleKeyboardIsOpen]);

	return {
		keyboardIsOpen,
		toggleKeyboardIsOpen,
		activeElement,
		defineActiveElement,
	};
};

export default useKeyboardState;
