import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/core";
import TabBarIcon from "../components/TabBarIcon";
import LogoutButton from "../components/LogoutButton";
import StockScreen from "../screens/WatchlistScreen";
import SearchScreen from "../screens/SearchScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Login";

function getHeaderTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;
}

export default function BottomTabNavigator({ navigation, route }) {
  React.useLayoutEffect(() => {
    if (navigation != null) {
      navigation.setOptions({ headerTitle: "Home" });
    }
  }, []);

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Watchlist"
        component={StockScreen}
        options={{
          headerRight: () => <LogoutButton />,
          tabBarLabel: "Watchlist",
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="trending-up" />
          ),
        }}
      />
      <BottomTab.Screen
        style={styles.heading}
        name="Search Stocks"
        component={SearchScreen}
        headerStyle={styles.heading}
        options={{
          headerRight: () => <LogoutButton />,
          tabBarLabel: "Search Stocks",
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="search" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  heading: {
    fontWeight: "bold",
    color: "#87CEEB",
  },
});
