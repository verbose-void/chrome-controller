const production = false;
export default {
    production,
    apiUrl: production
        ? 'https://chrome-controller-api.herokuapp.com/'
        : 'http://127.0.0.1:5000'
}