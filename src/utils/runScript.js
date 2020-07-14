import handleRuntimeError from "./handleRuntimeError";

const runScript = (code) => {
    chrome.tabs.executeScript(null, { code }, handleRuntimeError);
}

export default runScript