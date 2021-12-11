import React, {FC, useState, useContext} from 'react';
import { Context } from '..';

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context)


    function login(){

    }

    function registration(){

    }

    return (
        <div>
            <input type="text"
                   placeholder='email'
                   value={email}
                   onChange={e => setEmail(e.target.value)}
            />


            <input type='password'
                   placeholder='password'
                   value={password}
                   onChange={e => setPassword(e.target.value)}
            />
            <button onClick={() => store.login(email, password)}>Login</button>
            <button onClick={() => store.registration(email, password)}>Registration</button>
        </div>
    );
};

export default LoginForm;