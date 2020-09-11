import React from 'react';

const Keyboard = () => {
    return (
        <div style={{
            position: 'absolute',
            width: '20%',
            height: '10%',
            top: 0,
            left: 0,
            background: 'red',
            zIndex: 5000,
        }}>
            Hello world
        </div>
    )
}

export default Keyboard;