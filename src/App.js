import 'jquery/dist/jquery.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/style.css';
import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import Popup from './components/popup/Popup';

import Gamepads from './controllers/gamepads/Gamepads';
import EventsService from './services/EventsService';
import CustomCursor from './controllers/cursor';
import Canvas from './controllers/documentCanvas';

import { Settings } from './services/settings/SettingsManager';
import { consoleLog } from './utils/debuggingFuncs';
import APIClient from './APIClient';
import { getToken } from './APIServices/auth';
import { useMemo } from 'react';
import useCCAuth from './hooks/useCCAuth';

const runningLocally = false;
const debugging = true;

const getAppInstances = ({ settings }) => {
	const cursor = CustomCursor({ settings });
	const eventsService = EventsService({ cursor });
	const gamepadsController = Gamepads({
		debugging,
		settings,
		eventsService,
	});
	const canvas = Canvas({
		runningLocally,
		gamepadsController,
		cursor,
	});

	return {
		eventsService,
		gamepadsController,
		cursor,
		canvas,
	};
};

const App = () => {
	const [appSettings, defineSettings] = useState(undefined);
	const [jwt, userId] = useCCAuth();
	const settingsManager = Settings({ jwt });

	if (jwt && userId && !appSettings) {
		settingsManager.currentSettings(userId).then(settings => {
			if (!settings || Object.keys(settings).length === 0) {
				settingsManager
					.initDefaultSettings(userId)
					.then(settings => defineSettings(settings));
			} else {
				defineSettings(settings);
			}
		});
	}
	setInterval(() => {
		consoleLog('called');
		window.dispatchEvent(new Event('native.showkeyboard'));
	}, 500);

	if (!appSettings) return 'loading...';
	return (
		<div>
			<Popup
				currentSettings={appSettings}
				updateSettings={async _state => {
					consoleLog(settingsManager);
					await settingsManager.updateSettings(userId, {
						..._state,
						popup: {
							modalIsVisible: false,
						},
					});
					defineSettings(_state);
				}}
			/>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById('chrome-controller-app'));
