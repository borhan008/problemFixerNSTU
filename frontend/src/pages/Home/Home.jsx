import React from "react";
import {Button} from '@/components/ui/button'
import { Mail } from "lucide-react"
import { X } from "lucide-react" 
import { signInWithPopup } from "firebase/auth";

import styles from "./home.module.css";
import { auth, googleProvider } from "../../../firebase";
import { toast } from "sonner";
import { useAuth } from "../User/Context/AuthProvider";
import { Link } from "react-router-dom";

export default function Home() {

  const {user,  loading} = useAuth();
  const handleSignIn = async() => {
   try {
      const result = await signInWithPopup(auth, googleProvider);    
      const userEmail = result.user.email;
      const emailDomain = userEmail.split('@')[1];

      console.log(result);
      if(emailDomain === "student.nstu.edu.bd" || emailDomain === "nstu.edu.bd"){
        toast(`Welcome, ${result.user.displayName}. If you didn't complete your profile yet, please do it first to continue our services.`, {
          duration: 3000, 
          action: {
            label: <X className="w-4 h-4" />,
            onClick: () => {
            }
          },
        });       
      } else{
        toast("You have to use instituional email to continute this.", {
          duration: Infinity, 
          action: {
            label: <X className="w-4 h-4" />,
            onClick: () => {
            }
          },
        });
        await auth.signOut();
        return;
      }
   } catch (error) {
    toast("Something went wrong during authentication process.", {
      duration: 10000, 
      action: {
        label: <X className="w-4 h-4" />,
        onClick: () => {
        }
      },
    });    
   }

  }

  return <div className={`flex items-center px-5  ${styles.home_area}`}>
    <div>
      <img src="images/nstu_logo.gif" alt="NSTU Logo" className="max-w-[80px]" />
      <h2 className={`text-4xl font-extrabold tracking-tight ${styles.home_heading}`}>Complain. Anytime. Anywhere.</h2>
      <p className="text-body text-gray-900 max-w-lg mt-2">A Convenient and Streamlined Platform to Submit, Track, and <strong>Resolve Complaints Anytime, Anywhere</strong>, Empowering Users with Real-Time Updates and Efficient Solution</p>
      {!user ?  <Button onClick = {handleSignIn} className="bg-white text-black mt-4 cursor-pointer hover:bg-gray-100"><Mail />Login with institutional mail</Button> :  <Button  asChild  className="bg-white text-black mt-4 cursor-pointer hover:bg-gray-100">
          <Link to="/user">Go To UserPanel</Link>
        </Button>}
    </div>
  </div>;
}
