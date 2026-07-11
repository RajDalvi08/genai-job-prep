import {createContext, useState} from 'react';
import { getMe } from './auth.api';


export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null); //basically from these we can understand whether user is logged in or not
    const [loading, setLoading] = useState(true);
   


    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>

    )
}