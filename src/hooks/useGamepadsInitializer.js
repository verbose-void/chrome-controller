import { useEffect } from 'react';
import { parseUID } from '../utils/controllerUtils';

const useGamepadsInitializer = (gamepadsController, mountCursor) => {
	const connectHandler = e =>
		gamepadsController
			.disconnectController(parseUID(e))
			.then(() => mountCursor(false));

	const disconnectHandler = e =>
		gamepadsController
			.connectController(parseUID(e))
			.then(() => mountCursor(true));

	useEffect(() => {
		window.addEventListener('gamepaddisconnected', connectHandler);
		window.addEventListener('gamepadconnected', disconnectHandler);

		return () => {
			window.removeEventListener('gamepaddisconnected', disconnectHandler);
			window.removeEventListener('gamepadconnected', connectHandler);
		};
	}, [gamepadsController]);
};

export default useGamepadsInitializer;
