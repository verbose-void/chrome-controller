import { parseUID } from '../utils/controllerUtils'
import CustomCursor from '../cursor';

export default ({
    gamepadsController,
    cursor
}) => {
    window.addEventListener('gamepaddisconnected', (e) => {
        gamepadsController
            .disconnectController(parseUID(e))
            .then(() => cursor.dismount())
    });
    window.addEventListener('gamepadconnected', (e) => {
        gamepadsController
            .connectController(parseUID(e))
            .then(() => cursor.mount())
    });

    let poll;
    const props = { pollingFrequency: 100 }
    
    return ({
        startEventPolling: () => {
            poll = setInterval(()=>{
                for (let i of navigator.getGamepads())
                    if (i) gamepadsController.execEvent(i);
            }, props.pollingFrequency)
        },
        stopEventPolling: () => {
            window.removeEventListener('gamepaddisconnected');
            clearInterval(poll);
        }
    })
}