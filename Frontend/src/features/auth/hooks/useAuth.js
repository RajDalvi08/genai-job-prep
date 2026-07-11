import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context.jsx";
import { login, logout, register, getMe } from "../services/auth.api.js";

//for managing state i.e auth.context.js and api layers
export const useAuth = () => {

    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    const handlelogin = async (email, password) => {
        setLoading(true); // jab tk api call complete nahi hota, loading true rahega bcoz user ko pata chale ki kuch ho raha hai
       try{
        const data = await login(email, password)
        setUser(data.user);
       }catch(err){

       }finally{
        setLoading(false);
       }
    }

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try{
        const data = await register(username, email, password)
        setUser(data.user);
        }catch(err){
        }
        finally{
        setLoading(false);
        }
}

    const handlelogout = async () => {
        setLoading(true);
        try{
        const data = await logout()
        setUser(null);
        }catch(err){

        }
        finally{
        setLoading(false);
        }
    }

        //page refresh fix after login
    useEffect(()=>{
        const getAndSetUser = async()=>{
            const data = await getMe()
            setUser(data.user)
            setLoading(false)//indicates tht loading is finished n app can now display now actual contents
        }

        getAndSetUser()
    }, [])
    return {user, loading, handleRegister, handlelogin, handlelogout}
}