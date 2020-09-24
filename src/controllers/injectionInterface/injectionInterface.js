import { consoleLog } from '../../utils/debuggingFuncs';
import handleRuntimeError from '../../utils/handleRuntimeError';

const injectionInterface = type => {
	return {
		exec: (eventQueue, setEventQueue) => {
			// setEventQueue(...eventQueue, type);
			consoleLog(eventQueue);
			switch (type) {
				case 'TAB_LEFT':
					chrome.tabs.query({}, tabs => {
						if (tabs.length === 1) return;
						const activeTab = tabs.findIndex(tab => tab.active === true);

						let tabToLeftOfActive =
							activeTab === 0 ? tabs.length - 1 : activeTab - 1;

						chrome.tabs.highlight(
							{ tabs: tabToLeftOfActive },
							handleRuntimeError
						);
					});
					break;
				case 'TAB_RIGHT':
					chrome.tabs.query({}, tabs => {
						if (tabs.length === 1) return;
						const activeTab = tabs.findIndex(tab => tab.active === true);

						let tabToRightOfActive =
							activeTab === tabs.length - 1 ? 0 : activeTab + 1;

						chrome.tabs.highlight(
							{ tabs: tabToRightOfActive },
							handleRuntimeError
						);
					});
					break;
			}
		},
	};
};

export default injectionInterface;
