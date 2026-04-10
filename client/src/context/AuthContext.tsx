import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api, { AUTH_TOKEN_KEY } from "../configs/api";
import toast from "react-hot-toast";
import axios from "axios";

interface AuthContextProps {
    isLoggedIn:boolean;
    setIsLoggedIn:(isLoggedIn:boolean) => void;
    user:IUser | null;
    setUser:(user:IUser | null)=>void;
    login:(user:{email:string; password:string})=>Promise<void>;
    signUp:(user:{name:string; email:string; password:string})=>Promise<void>;
    logout:()=>Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn:false,
    setIsLoggedIn:()=>{},
    user:null,
    setUser:()=>{},
    login:async()=>{},
    signUp:async()=>{},
    logout:async()=>{},
})

export const AuthProvider = ({children}:{children:React.ReactNode})=>{

    const [user,setUser] = useState<IUser | null>(null)
    const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false)

    const getErrorMessage = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || error.message
        }
        if (error instanceof Error) {
            return error.message
        }
        return 'Something went wrong. Please try again.'
    }

    const signUp = async({name,email,password}:{name:string; email:string;password:string})=>{
        try {
            const {data} = await api.post('/api/auth/register',{name,email,password})

            if (data.user) {
                setUser(data.user as IUser)
                setIsLoggedIn(true)
            }
            if (data.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token as string)
            }
            toast.success(data.message)

        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error))
        }
    }
    const login = async({email,password}:{email:string;password:string})=>{
         try {
            const {data} = await api.post('/api/auth/login',{email,password})

            if (data.user) {
                setUser(data.user as IUser)
                setIsLoggedIn(true)
            }
            if (data.token) {
                localStorage.setItem(AUTH_TOKEN_KEY, data.token as string)
            }
            toast.success(data.message)
            
        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error))
        }
    }
    const logout = async()=>{
        try {
            const {data} = await api.post('/api/auth/logout')
            toast.success(data.message)
        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error))
        } finally {
            localStorage.removeItem(AUTH_TOKEN_KEY)
            setUser(null)
            setIsLoggedIn(false)
        }
    }
    const fetchUser = async()=>{
        try {
            const {data} = await api.get('/api/auth/verify')

            if (data.user) {
                setUser(data.user as IUser)
                setIsLoggedIn(true)
            }
            
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                localStorage.removeItem(AUTH_TOKEN_KEY)
                setUser(null)
                setIsLoggedIn(false)
            }
        }
    }

    useEffect(()=>{
        (async()=>{
            await fetchUser();
        })();
    },[])

    const value = {
        user,setUser,isLoggedIn,setIsLoggedIn,
        signUp,login,logout,

    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> useContext(AuthContext)