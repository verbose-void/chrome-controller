import { consoleLog } from "./debuggingFuncs";

export default () => {
    consoleLog(chrome.runtime.lastError);
};
