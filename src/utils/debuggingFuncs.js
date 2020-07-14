export const consoleLog = (...args) => {
    chrome.extension.getBackgroundPage().console.log(...args)
}