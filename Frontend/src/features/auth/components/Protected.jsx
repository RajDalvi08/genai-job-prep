import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";



import React from 'react'

const Protected = ({children}) => {
    const {loading, user} = useAuth()
    
 //page is loading and user is logged in means user is existing
    if(loading){ 
        return (<main>
            <h1>Loading...</h1>
        </main>)
    }
    //if user not exist then navigate to login
    if(!user){
     return <Navigate to={'/login'}/>
     return null
    }
  return children //it is basically for every page after logged in website basicallyy no need to define for multiple dashboards so we use it
}

export default Protected
