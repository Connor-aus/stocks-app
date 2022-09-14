import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const BUTTON_SIZE = 30;
const BORDER_WIDTH = 2;

export default function CloseButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.button}>
      <Icon name={"close"} color={"white"} size={BUTTON_SIZE / 2} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_SIZE + BORDER_WIDTH,
    height: BUTTON_SIZE + BORDER_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderRadius: BUTTON_SIZE / 3,
  },
});
