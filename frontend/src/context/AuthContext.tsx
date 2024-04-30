import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {
  const [authTokens, setAuthTokens] = useState(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      setAuthTokens(JSON.parse(storedTokens));
    }
  }, []);

  const clearTokens = () => {
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, clearTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


