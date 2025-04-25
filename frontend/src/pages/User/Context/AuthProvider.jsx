import { getAuth } from "firebase/auth";
import { useContext, createContext, useEffect, useState } from "react";
import { auth } from "../../../../firebase";
import Loading from "../../Common/Loading";
import Home from "../../Home/Home";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";


const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(user) => {
      setLoading(true);
      setUser(user);
      try {
        const token = await auth?.currentUser?.getIdToken();
        const response = await axios.get(`${backendURL}/user`, {
          headers : {
            'authorization' : `Bearer ${token}`
          }
        });
        setProfileComplete(true);
        setUser({...user, role : response.data.user.role});

      } catch (error) {
        console.log(error);
        setProfileComplete(false);
      } finally{
        setLoading(false);
      }
     
    });
    return () => unsubscribe();
  }, []);


 
 
  if(loading) return <Loading />

  return <AuthContext.Provider value={{user, loading, setLoading, profileComplete}}>
    { user ? children : <Home/>}
  </AuthContext.Provider>;
};

export const useAuth = () =>{
  return useContext(AuthContext);
}
