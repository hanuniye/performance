import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext({});

export const GlobalProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Load auth data from localStorage if it exists
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const [HRdata, setHRdata] = useState([]);

  useEffect(() => {
    // Persist auth data to localStorage whenever it changes
    if (auth) {
      console.log("auth with data")
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth"); // Clear when logged out
      console.log("auth without data")
    }
    
  }, [auth]);

  return (
    <GlobalContext.Provider
      value={{ auth, setAuth, sidebarToggle, setSidebarToggle, HRdata, setHRdata }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
