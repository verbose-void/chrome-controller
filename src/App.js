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
					chrome.tabs.query({ active: true, currentWindow: true }, function (
						tabs
					) {
						chrome.tabs.sendMessage(tabs[0].id, { type: 'SETTINGS_UPDATED' });
					});
				}}
			/>
		</div>
	);
};

chrome.runtime.onConnect.addListener(port => {
	console.assert(port.name === 'chrome-controller-injection');
	port.onMessage.addListener(msg => {
		const { type, action } = msg;
		if (action) {
			try {
				injectionInterface(type).exec();
				port.postMessage({ success: true });
			} catch (e) {
				port.postMessage({ success: false });
				consoleLog(e);
			}
		}
	});
});
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// 	console.log('message received');
// 	if (sender.tab.active) {
// 		try {
// 			injectionInterface(request.type).exec();
// 			sendResponse({ success: true });
// 		} catch (e) {
// 			sendResponse({ success: false });
// 			consoleLog(e);
// 		}
// 	}

// 	return true;
// });

ReactDOM.render(<App />, document.getElementById('chrome-controller-app'));
