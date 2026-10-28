import {
  createContext,
  useState,
} from "react";

export const AuthContext =
  createContext(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export default function AuthProvider({
  children,
}) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem(USER_KEY);

    try {
      return storedUser
        ? JSON.parse(storedUser)
        : null;
    } catch {
      return null;
    }
  });

  const login = (loginData) => {
    const token = loginData?.token;
    const user = loginData?.user;

    if (!token) {
      throw new Error(
        "Authentication token is missing."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      token
    );

    if (user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
    }

    setToken(token);
    setUser(user || null);
  };

  const logout = () => {
    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      USER_KEY
    );

    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading: false,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}