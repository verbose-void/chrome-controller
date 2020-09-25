import { consoleLog } from '../../utils/debuggingFuncs';
import handleRuntimeError from '../../utils/handleRuntimeError';

const injectionInterface = type => {
	return {
		exec: async () => {
			switch (type) {
				case 'TAB_LEFT':
					chrome.tabs.query({}, tabs => {
						if (tabs.length === 1) return;
						const activeTab = tabs.findIndex(tab => tab.active === true);
						const tabToLeftOfActive =
							activeTab === 0 ? tabs.length - 1 : activeTab - 1;

						chrome.tabs.highlight({
							tabs: tabToLeftOfActive,
						});
						return true;
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
