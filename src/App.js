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

import { Settings } from './settings/Settings';
import { consoleLog } from './utils/debuggingFuncs';
import APIClient from './APIClient';

const runningLocally = false;
const debugging = true;

const getAppInstances = async () => {
  const settings = await Settings({ debugging, runningLocally });
  const eventsService = await EventsService();
  const gamepadsController = await Gamepads({
    debugging,
    settings,
    eventsService,
  });
  const cursor = await CustomCursor({ settings });
  const canvas = await Canvas({
    runningLocally,
    gamepadsController,
    cursor,
  });

  return {
    settings,
    eventsService,
    gamepadsController,
    cursor,
    canvas,
  };
};

const App = () => {
  const [instances, setInstances] = useState({});
  const [appSettings, defineSettings] = useState(undefined);
  consoleLog('appsettings', appSettings);
  useEffect(() => {
    (async () => {
      const { settings, cursor, canvas } = await getAppInstances();
      setInstances({ settings, cursor, canvas });
    })();
  }, []);

  if (!instances.settings) return <p>Loading...</p>;

  const { settings, cursor, canvas } = instances;
  const storeProps = {
    currentSettings: appSettings ? appSettings : settings.currentSettings,
    updateSettings: (_state) => {
      settings.updateSettings(_state);
      defineSettings(settings.currentSettings);
      cursor.refreshCursor();
    },
  };

  if (canvas) canvas.startEventPolling();

  return <Popup {...storeProps} />;
};

ReactDOM.render(<App />, document.getElementById('app'));
