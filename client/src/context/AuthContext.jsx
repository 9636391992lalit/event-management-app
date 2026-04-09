import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  /// Login
 const login = (data) => {
  setUser(data.user);
  setToken(data.token);
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

  /// Logout
const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/// Hook
export const useAuth = () => useContext(AuthContext);