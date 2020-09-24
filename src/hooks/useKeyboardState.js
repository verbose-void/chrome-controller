import { useEffect, useState } from 'react';

const useKeyboardState = () => {
	const [keyboardIsOpen, toggleKeyboardIsOpen] = useState(false);
	useEffect(() => {
		const elsToListenTo = ['textarea', 'input'];
		elsToListenTo.forEach(el => {
			document.querySelectorAll(el).forEach(element => {
				element.addEventListener('focus', e => {
					toggleKeyboardIsOpen(true);
				});
				element.addEventListener('blur', e => {
					toggleKeyboardIsOpen(false);
				});
			});
		});

		return () => {
			elsToListenTo.forEach(el => {
				element.classList.add('remove');
				document.querySelectorAll(el).forEach(element => {
					element.removeEventListener('focus', e => {
						toggleKeyboardIsOpen(true);
					});
					element.removeEventListener('blur', e => {
						toggleKeyboardIsOpen(false);
					});
				});
			});
		};
	}, [toggleKeyboardIsOpen]);

	return [keyboardIsOpen, toggleKeyboardIsOpen];
};

export default useKeyboardState;
