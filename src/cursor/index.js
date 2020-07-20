import runScript from "../utils/runScript";
import insertCSS from "../utils/insertCSS";
import sleep from "../utils/sleep";

const { consoleLog } = require("../utils/debuggingFuncs");

const CustomCursor = async ({ settings }) => {
    const { cursor } = settings.generalTab;
    const color = cursor.color;
    const horizontalSpeed = cursor.horizontalSpeed;
    const idleHideTimer = cursor.idleHideTimer;
    const radius = cursor.radius;
    const verticalSpeed = cursor.verticalSpeed;

    const mount = () => {
        runScript(`
            const el = document.createElement('div')
            el.id = "cursor"
            const { style } = el
            document.querySelector('body').appendChild(el)
        `);
        insertCSS(`
            #cursor {
                position: absolute;
                z-index: 5000;
                top: 0;
                left: 0;
                border-radius: 50%;
                background-color: ${color};
                height: ${radius * 2}px;
                width: ${radius * 2}px;
            }
        `);
    };

    const dismount = async () => {
        runScript(`
            const cursor = document.querySelector("#cursor")
            document.querySelector('body').removeChild(cursor)
        `);
    };

    return {
        mount: () => setTimeout(() => mount(), 1),
        dismount: () => setTimeout(() => dismount(), 1),
        refreshCursor: () =>
            setTimeout(() => {
                dismount().then(() => mount());
            }, 10),
    };
};

export default CustomCursor;
