import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import Keyboard from './keyboard';

const InjectedApp = () => {
    const [keyboardIsOpen, toggleKeyboardIsOpen] = useState(false);

    useEffect(() => {
        const elsToListenTo = ['textarea', 'input'];
        elsToListenTo.forEach(el => {
            document.querySelectorAll(el).forEach(element => {
                element.addEventListener('focus', e => {
                    toggleKeyboardIsOpen(true);
                })
                element.addEventListener('blur', e => {
                    toggleKeyboardIsOpen(false);
                })
            })
        })

        return () => {
            elsToListenTo.forEach(el => {
                document.querySelectorAll(el).forEach(element => {
                    element.removeEventListener('focus', e => {
                        toggleKeyboardIsOpen(true);
                    })
                    element.removeEventListener('blur', e => {
                        toggleKeyboardIsOpen(false);
                    })
                })
            })
        }
    }, [toggleKeyboardIsOpen])
    console.log('hello world')
    return (
        <React.Fragment>
            {keyboardIsOpen && (
                <Keyboard />
            )}
        </React.Fragment>
    )
}

const injectionContainer = document.createElement('div');
injectionContainer.id = 'injection_container';
if (!document.querySelector('#chrome-controller-app')) {
    document.querySelector('body').appendChild(injectionContainer);
    ReactDOM.render(<InjectedApp />, document.querySelector('#injection_container'));
}