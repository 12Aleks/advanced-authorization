import React, {FC, useState, useContext} from 'react';
import { Context } from '..';
import {observer} from "mobx-react-lite";
import UserService from "../services/UserService";
import {IUser} from "../models/IUser";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([]);


    async function getUsers(){
        try{
            const response = await UserService.fetchUsers();
            setUsers(response.data)
        }catch(e){
            console.log(e)
        }
    }

    return (
        <div className="login-box">
            <div className="title">
                <h2>{store.isAuth ? `User is logged`: `Please log in`}</h2>
            </div>
            {store.isAuth ?
                <div className='all'>
                    {
                        !users.length || <>
                        <h2>List all users</h2>
                        <table>
                            <tr>
                                <th>User ID</th>
                                <th>User email</th>
                            </tr>
                            {users.map((user, index) =>
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{user.email}</td>
                                </tr>
                            )}
                        </table>
                        </>
                    }


                </div>
                :
                <form>
                    <div className="user-box">
                        <input type="text"
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                               required/>
                        <label>Email</label>
                    </div>
                    <div className="user-box">
                        <input type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                               required
                        />
                        <label>Password</label>
                    </div>

                </form>
            }
            {store.isAuth ?
                <div
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
                    <a onClick={() => store.logout()}>Logout</a>
                    <a onClick={getUsers}>Get all users</a>
                </div> :
                <div
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "100%"}}>
                    <a onClick={() => store.login(email, password)}>Login</a>
                    <a onClick={() => store.registration(email, password)}>Registration</a>
                </div>
            }
        </div>
    );
};

export default observer(LoginForm);