import { parseUID } from '../utils/controllerUtils'
import CustomCursor from '../cursor';

export default ({
    gamepadsController,
    cursor
}) => {
    console.log(cursor)
    let poll;
    const props = { pollingFrequency: 100 }

    window.addEventListener('gamepaddisconnected', (e)=>{
        gamepadsController
            .disconnectController(parseUID(e))
            .then(()=>cursor.dismount())
    })
    window.addEventListener('gamepadconnected', (e)=>{
        gamepadsController
            .connectController(parseUID(e))
            .then(()=>cursor.mount())
    })
    
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