import { createContext, useContext, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Loader } from "../components";

export const ApiContext = createContext<any | null>(null);

export const ApiProvider = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setLoading(true);
        await fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ token: response.access_token }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => response.json());

        const user = await fetch("/api/auth/session").then((response) =>
          response.json()
        );
        console.log("Successfully logged in!", user);
        setUser(user);
        navigate("/", { replace: true });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after login process completes
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  // call this function to sign out logged in user
  const logout = () => {
    googleLogout();
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <ApiContext.Provider value={value}>
      {loading ? <Loader /> : <Outlet />}
    </ApiContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(ApiContext);
};
