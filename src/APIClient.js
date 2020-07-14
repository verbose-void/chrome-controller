const APIClient = ({ production }) => {
  const url = production
    ? 'https://chrome-controller-api.herokuapp.com/'
    : '127.0.0.1:5000';

  const JWT = localStorage.getItem('jwt');

  return async (endpoint, opts) => {
    const defaultOpts = {
      method: 'GET',
      headers: {
        'x-access-token': JWT,
      },
    };
    const options = {
      ...defaultOpts,
      ...opts,
    };

    const res = await fetch(
      `${url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
      options
    );
    return res.json();
  };
};

export default APIClient;
