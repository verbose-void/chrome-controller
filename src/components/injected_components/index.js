import ReactDOM from 'react-dom';
import React, { useState, useEffect, useCallback } from 'react';
import Keyboard from './keyboard';
import Cursor from './cursor';
import Gamepads from '../../controllers/gamepads/Gamepads';
import EventsService from '../../services/EventsService';
import Canvas from '../../controllers/documentCanvas';

const initSettings = (appSettings, defineSettings) => {
	chrome.storage.local.get('settings', settings => {
		if (!appSettings && settings && settings.settings) {
			defineSettings(settings.settings);
		}
	});
};

const getAppInstances = ({ settings }) => {
	console.log(settings);
	const eventsService = EventsService();
	const gamepadsController = Gamepads({
		debugging: true,
		settings,
		eventsService,
	});
	const canvas = Canvas({
		gamepadsController,
	});

	return {
		eventsService,
		gamepadsController,
		canvas,
	};
};

const InjectedApp = () => {
	const [keyboardIsOpen, toggleKeyboardIsOpen] = useState(false);
	const [appSettings, defineSettings] = useState(undefined);
	initSettings(appSettings, defineSettings);

	useEffect(() => {
		const elsToListenTo = ['textarea', 'input'];
		elsToListenTo.forEach(el => {
			document.querySelectorAll(el).forEach(element => {
				// element.classList.add('daisywheel');
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

	if (!appSettings) return <></>;

	// const { canvas } = getAppInstances({ settings: appSettings });
	// if (canvas) canvas.startEventPolling();

	return (
		<React.Fragment>
			{keyboardIsOpen && (
				<Keyboard color={appSettings.generalTab.cursor.color} />
			)}
			<Cursor
				color={appSettings.generalTab.cursor.color}
				radius={appSettings.generalTab.cursor.radius}
			/>
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
