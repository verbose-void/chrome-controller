import 'jquery/dist/jquery.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/style.css';
import ReactDOM from 'react-dom';
import React, { useState, useRef } from 'react';
import Popup from './components/popup/Popup';
import { Settings } from './services/settings/SettingsManager';
import { consoleLog } from './utils/debuggingFuncs';
import useCCAuth from './hooks/useCCAuth';
import { injectionInterface } from './controllers';
import uniqBy from 'lodash/uniqBy';

const App = () => {
	const [appSettings, defineSettings] = useState(undefined);
	const [jwt, userId] = useCCAuth();
	const queueRef = useRef([]);
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

	if (!appSettings) return 'loading...';

	chrome.storage.local.set({ settings: appSettings });
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		// todo fix me
		queueRef.current = uniqBy([...queueRef.current, request.type]);
		try {
			injectionInterface(request.type).exec();
			queueRef.current = queueRef.current.filter(x => x !== request.type);
			sendResponse({ success: true });
		} catch (e) {
			sendResponse({ success: false });
			consoleLog(e);
		}
	});

	return (
		<div>
			<Popup
				currentSettings={appSettings}
				updateSettings={async _state => {
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
