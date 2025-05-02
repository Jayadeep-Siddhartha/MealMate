// hooks/useFirebaseAuth.js
import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { getAuth, signInWithCredential, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';

// Initialize Firebase Auth
const auth = getAuth();

export const useFirebaseAuth = () => {
  // 🔹 Google Auth
  const [googleRequest, googleResponse, promptGoogleSignIn] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // use EXPO_PUBLIC_ prefix for mobile env access
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [googleResponse]);

  // 🔹 Facebook Auth
  const [fbRequest, fbResponse, promptFacebookSignIn] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential);
    }
  }, [fbResponse]);

  return {
    promptGoogleSignIn,
    promptFacebookSignIn,
    googleRequest,
    fbRequest,
  };
};
