import React, { useRef } from 'react';
import ReactKeyboard from 'react-simple-keyboard';
import styled from 'styled-components';
import 'react-simple-keyboard/build/css/index.css';

const KeyboardContainer = styled.div`
	display: flex;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;

	.inner {
		display: flex;
		position: absolute;
		top: 40%;
		width: 90%;
		left: 5%;
		right: 5%;
		z-index: 5000;
	}
`;

const Keyboard = (
	keyboardIsOpen,
	toggleKeyboardIsOpen,
	activeElement,
	defineActiveElement
) => {
	console.log(activeElement);
	const innerRef = useRef(null);
	const onChange = input => {
		console.log(input);
	};

	const onKeyPress = button => {
		console.log(button);
	};

	return (
		<KeyboardContainer
			onClick={e => {
				if (!innerRef.current.contains(e.target)) {
					toggleKeyboardIsOpen(false);
				} else {
					toggleKeyboardIsOpen(true);
				}
			}}
		>
			<div className='inner' ref={innerRef}>
				<ReactKeyboard onChange={onChange} onKeyPress={onKeyPress} />
			</div>
		</KeyboardContainer>
	);
};

export default Keyboard;
