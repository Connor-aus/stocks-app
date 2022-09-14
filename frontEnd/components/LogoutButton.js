import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scaleSize } from "../constants/Layout";

import { useAuth } from "../contexts/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <View style={styles.button}>
      <TouchableOpacity onPress={() => logout()}>
        <View>
          <Text style={styles.text}>Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#202020",
    color: "white",
    borderRadius: 2,
    borderColor: "white",
    borderWidth: 1,
    width: scaleSize(80),
    margin: 8,
    paddingRight: 5,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 20,
    fontSize: 20,
    color: "white",
    fontSize: scaleSize(12),
  },
});
