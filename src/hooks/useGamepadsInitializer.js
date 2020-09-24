import { useEffect } from 'react';
import { parseUID } from '../utils/controllerUtils';

const useGamepadsInitializer = (gamepadsController, mountCursor) => {
	useEffect(() => {
		window.addEventListener('gamepaddisconnected', e => {
			gamepadsController
				.disconnectController(parseUID(e))
				.then(() => mountCursor(false));
		});
		window.addEventListener('gamepadconnected', e => {
			gamepadsController
				.connectController(parseUID(e))
				.then(() => mountCursor(true));
		});

		return () => {
			window.removeEventListener('gamepaddisconnected', e => {
				gamepadsController
					.disconnectController(parseUID(e))
					.then(() => mountCursor(false));
			});
			window.removeEventListener('gamepadconnected', e => {
				gamepadsController
					.connectController(parseUID(e))
					.then(() => mountCursor(true));
			});
		};
	}, [gamepadsController]);
};

export default useGamepadsInitializer;
