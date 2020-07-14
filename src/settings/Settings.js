import { consoleLog } from "../utils/debuggingFuncs";
import sleep from "../utils/sleep";

export const Settings = async ({ debugging, runningLocally }) => {
    let _settings;
    chrome.storage.sync.get(["data"], (res) => (_settings = res));
    await sleep(100);

    const loadSettings = () => {
        if (!runningLocally) {
            chrome.storage.sync.get(["data"], (res) => (_settings = res));
        }
    };

    const updateSettings = (state) => {
        const update = async (data) => {
            chrome.storage.sync.set({ data });
        };
        update(state).then(() => loadSettings());
    };

    loadSettings();

    return {
        loadSettings,
        updateSettings,
        get currentSettings() {
            chrome.storage.sync.get(["data"], (res) => (_settings = res));
            (async () => {
                await sleep(100);
            })();
            return _settings.data;
        },
    };
};
