const deriveInputValue = (initialValue, keyPressed) => {
	const nonInputKeys = [
		'{tab}',
		'{caps}',
		'{shift}',
		'{enter}',
		'{bksp}',
		'{space}',
	];
	if (!nonInputKeys.includes(keyPressed)) {
		return initialValue + keyPressed;
	}

	switch (keyPressed) {
		case '{bksp}':
			return initialValue.length > 0
				? initialValue.substring(0, initialValue.length - 1)
				: '';
		case '{space}':
			return initialValue + ' ';
		case '{tab}':
			return initialValue;
		case '{caps}':
			return;
		case '{shift}':
			return;
		default:
			throw new Error('key unaccounted for');
	}
};

export default deriveInputValue;
