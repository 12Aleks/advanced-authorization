import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";

export const API_URL = `http://localhost:5000/api`

//instanc axios
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
// jesli status 401 (polzowatel nie awtorizowan), istok akcess token, refresh token awtomatom perezapisywajet access token

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config;
    if(error.response.status == 401 && error.config && !error.config._isRetry){
        originalRequest._isRetry = true;
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        }catch(e){
            console.log(e)
        }
    }
    throw error
});

export default $api;