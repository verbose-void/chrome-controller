import runScript from '../../utils/runScript';
import insertCSS from '../../utils/insertCSS';
import { consoleLog } from '../../utils/debuggingFuncs';

const CustomCursor = ({ settings }) => {
	const { cursor } = settings.generalTab;
	const color = cursor.color;
	const radius = cursor.radius;

	const mount = () => {
		runScript(`
            if (!document.querySelector('#cursor')) {
                document.querySelector('body').innerHTML =
                    document.querySelector('body').innerHTML +=
                        '<div id="cursor"></div>'
            }
        `);
		insertCSS(`
            #cursor {
                position: absolute;
                z-index: 10000;
                top: 0;
                left: 0;
                border-radius: 50%;
                background-color: ${color};
                height: ${radius * 2}px;
                width: ${radius * 2}px;
                transition: transform .2s ease-out;
            }
        `);
	};

	const dismount = () => {
		runScript(`
            if (document.querySelector("#cursor")) {
                delete document.cursor;
                document.querySelector('body').removeChild(document.querySelector('#cursor'))
            }
        `);
	};

	const refreshCursor = () => {
		dismount();
		setTimeout(() => {
			mount();
		}, 0);
	};

	chrome.tabs.onUpdated.addListener((tabId, changeInfo, __) => {
		if (changeInfo.status === 'complete') {
			chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
				const currTab = tabs[0];
				if (currTab && currTab.id !== tabId) {
					refreshCursor();
				}
			});
		}
	});

	chrome.tabs.onActivated.addListener(() => {
		refreshCursor();
	});

	return {
		mount: () => {
			setTimeout(() => mount(), 1);
		},
		dismount,
		refreshCursor,
	};
};

export default CustomCursor;
