import { useEffect, useState } from 'react';

const useChromeSettings = () => {
	const [appSettings, defineSettings] = useState(undefined);
	useEffect(() => {
		chrome.storage.local.get('settings', settings => {
			if (!appSettings && settings && settings.settings) {
				defineSettings(settings.settings);
			}
		});
	}, []);

	return [appSettings, defineSettings];
};

export default useChromeSettings;
