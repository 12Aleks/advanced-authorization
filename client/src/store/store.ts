import { makeAutoObservable } from 'mobx'
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false

    constructor() {
        makeAutoObservable(this)
    }

    setLoading(bool: boolean){
        this.isLoading = bool;
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e)
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response)
            localStorage.removeItem('token');
            this.setAuth(false)
            this.setUser({} as IUser)
        }  catch (e) {
            console.log(e);
        }
    }

    async checkAuth(){
        this.setLoading(true);
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
           localStorage.setItem('token', response.data.accessToken);
           this.setAuth(true);
           this.setUser(response.data.user);
        }catch(e){
            console.log(e);
        }finally{
            this.setLoading(false);
        }
    }
}