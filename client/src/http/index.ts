import axios from 'axios';

export const API_URL = `http://localhost:5000/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});


//Interceptor - perechwatczik, srabatywajuszij na zapros na server,
// vo vrema nego interceptor ustanawliwajet headers.Authorization s tokenom
$api.interceptors.request.use(config => {
    // @ts-ignore
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

//interceptor srabarywajuszij na otwet servera,
// jesli status 401 (polzowatel nie awtorizowan), istok akcess token

export default $api;