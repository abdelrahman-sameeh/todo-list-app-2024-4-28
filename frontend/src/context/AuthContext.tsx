import { createContext, useContext, useEffect, useState } from "react";
import { AxiosHook } from "../api/AxiosHook";
import { API_ENDPOINTS } from "../api/EndPoints";

const AuthContext = createContext({});


export const AuthProvider = ({ children }: any) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState({})

  const getUser = async () => {
    const response = await AxiosHook(true, API_ENDPOINTS.getUpdateLoggedUser, 'GET', {})
    if (response.status == 200) {
      setUser(response.data)
    }
  }
  

  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens)
      setAuthTokens(tokens);
      getUser()
    }
  }, []);

  const clearTokens = () => {
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, clearTokens, setAuthTokens, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


