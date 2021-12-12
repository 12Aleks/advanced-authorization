import React, {useContext, useEffect, useState} from 'react';
import LoginForm from './componnts/LoginForm';
import {Context} from "./index";
import './style/css.css'
import {observer} from "mobx-react-lite";


function App() {
   const {store} = useContext(Context);

   useEffect(() => {
        if(localStorage.getItem('token')){
            store.checkAuth()
        }
   }, []);





    if(store.isLoading){
        return <div className='loading'>LOADING ...</div>
    }

    return (
    <div className="App">
     <LoginForm />
    </div>
  );
}

export default observer(App);
