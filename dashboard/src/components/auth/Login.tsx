"use client";

import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function Login() {
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithFacebook = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.log("User closed the popup before completing sign in.");
      } else {
        console.error("Facebook login error:", error);
      }
    }
  };
  
  

  return (
    <div className="space-y-4">
      <Button onClick={loginWithGoogle}>Sign in with Google</Button>
      <Button onClick={loginWithFacebook}>Sign in with Facebook</Button>
    </div>
  );
}
