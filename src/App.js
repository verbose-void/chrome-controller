import 'jquery/dist/jquery.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/style.css';
import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import Popup from './components/Popup';

import Gamepads from './gamepads/Gamepads';
import EventsService from './EventsService';
import CustomCursor from './cursor';
import Canvas from './documentCanvas';

import { Settings } from './settings/SettingsManager';
import { consoleLog } from './utils/debuggingFuncs';
import APIClient from './APIClient';
import { getToken } from './APIServices/auth';

const runningLocally = false;
const debugging = true;

const getAppInstances = ({settings}) => {
  const cursor = CustomCursor({ settings });
  const eventsService = EventsService({ cursor });
  const gamepadsController = Gamepads({
    debugging,
    settings,
    eventsService,
  });
  const canvas = Canvas({
    runningLocally,
    gamepadsController,
    cursor,
  });

  return {
    eventsService,
    gamepadsController,
    cursor,
    canvas,
  };
};

const App = () => {
  const [jwt, setJwt] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [appSettings, defineSettings] = useState(undefined);

  const settingsManager = Settings({jwt});

  useEffect(() => {
    chrome.storage.sync.get(['userId'], async res => {
        window.removeEventListener('gamepaddisconnected', () => {
          consoleLog('event listener removed')
        });
        if (!jwt) {   
            const token = await getToken(res.userId);
            if (token) {
                chrome.storage.sync.set({ userId: token.userId });
                setJwt(token);
                setUserId(token.userId)
            }
        }
    });
  }, [jwt, appSettings]);

  if (jwt && userId && !appSettings) {
    settingsManager.currentSettings(userId).then(settings=>{
        if (!settings || Object.keys(settings).length === 0) {
            settingsManager
                .initDefaultSettings(userId)
                .then(settings=>defineSettings(settings));
        } else {
          defineSettings(settings);
        }
    })
  }
  
  if (!appSettings) return <p>Loading...</p>;
  const { canvas } = getAppInstances({settings: appSettings});
  if (canvas) canvas.startEventPolling();

  return (
    <Popup
        currentSettings={appSettings}
        updateSettings={async (_state) => {
            const newSettings = await settingsManager.updateSettings(userId, {
                ..._state,
                popup: {
                    modalIsVisible: false
                }
            });
            defineSettings(newSettings);
        }}
    />
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
