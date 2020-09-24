import { useState, useEffect } from 'react';
import { getToken } from '../APIServices/auth';
import { Settings } from '../services/settings/SettingsManager';
import { consoleLog } from '../utils/debuggingFuncs';

const useCCAuth = () => {
	const [jwt, setJwt] = useState(undefined);
	const [userId, setUserId] = useState(undefined);

	useEffect(() => {
		chrome.storage.sync.get(['userId'], async res => {
			if (!jwt) {
				const token = await getToken(res.userId);
				if (token) {
					chrome.storage.sync.set({ userId: token.userId });
					setJwt(token);
					setUserId(token.userId);
				}
			}
		});
	}, [jwt]);

	return [jwt, userId];
};

export default useCCAuth;
