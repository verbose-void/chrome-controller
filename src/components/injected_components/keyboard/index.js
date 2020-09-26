import React, { useRef } from 'react';
import ReactKeyboard from 'react-simple-keyboard';
import styled from 'styled-components';
import 'react-simple-keyboard/build/css/index.css';
import useKeyboardState from '../../../hooks/useKeyboardState';

const KeyboardContainer = styled.div`
	display: flex;
	z-index: 100000000;
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;

	.inner {
		display: flex;
		position: absolute;
		top: 60%;
		width: 90%;
		left: 5%;
		right: 5%;
	}
`;

const Keyboard = () => {
	const [keyboardState, dispatchKeyboardEvent] = useKeyboardState();
	const innerRef = useRef(null);

	const onKeyPress = button => {
		if (!button) return;
		if (
			button === '{enter}' &&
			keyboardState.activeElement.tagName === 'INPUT'
		) {
			const keydownEv = new KeyboardEvent('keydown', {
				view: window,
				bubbles: true,
				cancelable: true,
				keyCode: 13,
			});
			console.log(keyboardState.activeElement);
			keyboardState.activeElement.dispatchEvent(keydownEv);
			return;
		}

		dispatchKeyboardEvent({
			type: 'CLICK_ON_KEYBOARD',
			payload: {
				value: button,
			},
		});
	};

	return (
		<React.Fragment>
			{keyboardState.keyboardIsOpen && (
				<KeyboardContainer
					onClick={e => {
						if (!innerRef.current.contains(e.target)) {
							dispatchKeyboardEvent({
								type: 'CLICK_OUTSIDE_KEYBOARD',
								payload: {},
							});
						}
					}}
				>
					<div
						onClick={e => onKeyPress(e.target.dataset.skbtn)}
						className='inner'
						ref={innerRef}
					>
						<ReactKeyboard layoutName={'default'} onKeyPress={onKeyPress} />
					</div>
				</KeyboardContainer>
			)}
		</React.Fragment>
	);
};

export default Keyboard;
