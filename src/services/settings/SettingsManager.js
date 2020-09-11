import { consoleLog } from '../../utils/debuggingFuncs';
import sleep from '../../utils/sleep';
import APIClient from '../../APIClient';
import { initialState } from "../../reducers/Reducers";

export const Settings = ({ jwt }) => {
  return {
    updateSettings: async (userId, settings) => {
      const res = await APIClient(
        `/user/update_settings/${userId}`,
        {
          method: 'POST',
          headers: {
            'x-access-token': jwt
          },
          body: { settings }
        }
      )

      return res
    },
    initDefaultSettings: async (userId) => {
      const res = await APIClient(
        `/user/update_settings/${userId}`,
        {
          method: 'POST',
          headers: {
            'x-access-token': jwt
          },
          body: {
            settings: {
              ...initialState
            }
          }
        }
      )
      return res
    },
    currentSettings: async (userId) => {
      const res = await APIClient(
        `/user/active_settings?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'x-access-token': jwt,
          }
        }
      )
      return res
    },
  };
};
