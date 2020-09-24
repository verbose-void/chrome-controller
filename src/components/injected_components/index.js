import ReactDOM from 'react-dom';
import React, { useState, useMemo, useEffect } from 'react';
import Keyboard from './keyboard';
import Cursor from './cursor';
import { Gamepads } from '../../controllers';
import EventsService from '../../services/EventsService';
import useKeyboardState from '../../hooks/useKeyboardState';
import useChromeSettings from '../../hooks/useChromeSettings';
import useGamepadsInitializer from '../../hooks/useGamepadsInitializer';

const InjectedApp = () => {
	const [appSettings, defineSettings] = useChromeSettings();
	const [keyboardIsOpen, toggleKeyboardIsOpen] = useKeyboardState();
	const [cursorIsMounted, mountCursor] = useState(false);

	const eventsService = EventsService();
	const gamepadsController = Gamepads({
		debugging: true,
		settings: appSettings,
		eventsService,
	});
	useGamepadsInitializer(gamepadsController, mountCursor);

	const poll = useMemo(() => {
		if (appSettings) {
			const pollingFrequency = 100;
			return setInterval(() => {
				for (let i of navigator.getGamepads())
					if (i) gamepadsController.execEvent(i);
			}, pollingFrequency);
		}
	}, [cursorIsMounted]);

	if (!cursorIsMounted) {
		clearInterval(poll);
	}

	if (!appSettings) return <></>;
	return (
		<React.Fragment>
			{keyboardIsOpen && (
				<Keyboard color={appSettings.generalTab.cursor.color} />
			)}
			{cursorIsMounted && (
				<Cursor
					color={appSettings.generalTab.cursor.color}
					radius={appSettings.generalTab.cursor.radius}
				/>
			)}
		</React.Fragment>
	);
};

const injectionContainer = document.createElement('div');
injectionContainer.id = 'injection_container';
if (!document.querySelector('#chrome-controller-app')) {
	document.querySelector('body').appendChild(injectionContainer);
	ReactDOM.render(
		<InjectedApp />,
		document.querySelector('#injection_container')
	);
}
