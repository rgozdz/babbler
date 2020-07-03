import React, { useEffect, useState } from "react";
import firebase from "./firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading]= useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setCurrentUser);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
