import globals from "./globals";
import { consoleLog } from "./utils/debuggingFuncs";

const APIClient = async (endpoint, opts) => {
  const defaultHeaders = {
    'x-access-token': null,
  }

  const defaultopts = {
    method: 'GET',
    headers: defaultHeaders
  };

  const options = {
    ...defaultopts,
    ...opts,
    headers: new Headers({
      'content-type': 'application/json',
      ...opts.headers
    })
  };

  if (options.method === 'POST') {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(
    `${globals.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
    {
      ...options
    }
  );

  if (res.status === 200) return res.json()
  
  return {
    error: `There was a problem making this API request, status code ${res.status}`,
    status: res.status
  }
};


export default APIClient;
