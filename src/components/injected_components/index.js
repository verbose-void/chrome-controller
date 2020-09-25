import ReactDOM from 'react-dom';
import React, { useState, useMemo, useEffect } from 'react';
import Keyboard from './keyboard';
import Cursor from './cursor';
import { Gamepads } from '../../controllers';
import EventsService from '../../services/EventsService';
import useKeyboardState from '../../hooks/useKeyboardState';
import useChromeSettings from '../../hooks/useChromeSettings';
import useGamepadsInitializer from '../../hooks/useGamepadsInitializer';

export const port = chrome.runtime.connect({
	name: 'chrome-controller-injection',
});

port.onMessage.addListener(msg => {
	// console.log(msg.success === true);
});

const InjectedApp = () => {
	const [appSettings, defineSettings] = useChromeSettings();
	const [keyboardIsOpen] = useKeyboardState();
	const [cursorIsMounted, mountCursor] = useState(false);

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.type === 'SETTINGS_UPDATED') {
			chrome.storage.local.get('settings', settings => {
				if (!appSettings && settings && settings.settings) {
					defineSettings(settings.settings);
				}
			});
		}
	});

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
