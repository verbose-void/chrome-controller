import { consoleLog } from '../../utils/debuggingFuncs';
import handleRuntimeError from '../../utils/handleRuntimeError';

const injectionInterface = type => {
	return {
		exec: () => {
			switch (type) {
				case 'TAB_LEFT':
					chrome.tabs.query({}, tabs => {
						if (tabs.length === 1) return;
						const activeTab = tabs.findIndex(tab => tab.active === true);
						const tabIndexToLeftOfActive =
							activeTab === 0 ? tabs.length - 1 : activeTab - 1;
						const tabIdToLeftOfActive = tabs[tabIndexToLeftOfActive].id;
						chrome.tabs.update(
							tabIdToLeftOfActive,
							{ active: true, selected: true },
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
