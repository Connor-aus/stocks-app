import * as React from "react";
import { Platform } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-gesture-handler";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoadingSymbol from "./components/LoadingSymbol";
import { StocksProvider } from "./contexts/StocksContext";
import { WatchlistProvider } from "./contexts/WatchlistContext";
import { QuoteHistoryProvider } from "./contexts/QuoteHistoryContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";

const Stack = createStackNavigator();

export default function App(props) {
  return (
    <AuthProvider>
      <StocksApp />
    </AuthProvider>
  );
}

export function StocksApp(props) {
  const { isLoading, token, isLogout } = useAuth();

  AsyncStorage.clear();

  return (
    <QuoteHistoryProvider>
      <WatchlistProvider>
        <StocksProvider>
          <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator>
              {isLoading ? (
                <Stack.Screen
                  name="Loading"
                  component={LoadingSymbol}
                  options={{ headerShown: false }}
                />
              ) : token === null ? (
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{
                    headerShown: false,
                  }}
                />
              ) : (
                <Stack.Screen
                  name="Navbar"
                  component={BottomTabNavigator}
                  options={{ headerShown: false }}
                />
              )}
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </StocksProvider>
      </WatchlistProvider>
    </QuoteHistoryProvider>
  );
}
