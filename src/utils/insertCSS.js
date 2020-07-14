const { default: handleRuntimeError } = require("./handleRuntimeError")

const insertCSS = (code) => {
    chrome.tabs.insertCSS(null, {code}, handleRuntimeError)
}

export default insertCSS