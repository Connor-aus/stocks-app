import React, { useState, useEffect, createContext, useContext } from "react";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DBURL } from "../components/DBURL.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogout, setIsLogout] = useState(false);

  let fetchToken = async () => {
    try {
      const value = await AsyncStorage.getItem("@Token");
      if (value !== null) {
        console.log("Token successfully retrieved");
        setToken(value);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to login");
      throw error;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: token,
        isLoading: isLoading,
        isLogout: isLogout,
        login: (user, pass) => login(user, pass, setToken),
        logout: () => logout(setIsLogout, setToken),
        register: (user, pass) => register(user, pass),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

async function login(user, pw, setToken) {
  const url = `${DBURL}/users/login`;

  try {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user, password: pw }),
    });

    let data = await res.json();

    if (data?.error == true) {
      alert("Failed to login\n" + data.message);
      console.log("Failed to login\n" + data.message);
      return;
    } else {
      setToken(data.token);
      AsyncStorage.setItem("@Token", JSON.stringify(data.token));
      return;
    }
  } catch (error) {
    console.log("Failed to login: " + error);
  }
}

async function logout(setIsLogout, setToken) {
  try {
    await AsyncStorage.removeItem("@Watchlist");
    await AsyncStorage.removeItem("@Token");
    setToken(null);
    setIsLogout(true);
  } catch (error) {
    alert("Failed to logout");
    console.log("Failed to logout: " + error);
  }
}

async function register(email, password) {
  const url = `${DBURL}/users/register`;

  try {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    let data = await res.json();

    if (data?.error == true) {
      alert("Failed to register member\n" + data.message);
      console.log("Failed to register member\n" + data.message);
      return false;
    } else {
      alert("Success! Account registerd");
      return true;
    }
  } catch (error) {
    console.log(error);
  }
}
