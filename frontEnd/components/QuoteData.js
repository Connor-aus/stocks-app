import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { scaleSize } from "../constants/Layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useWatchlist } from "../contexts/WatchlistContext";

export default function QuoteData(props) {
  const { quotelist } = useWatchlist();

  let quote;

  for (let i = 0; i < quotelist.length; i++) {
    if (quotelist[i].symbol === props.quote.stock) {
      quote = quotelist[i];
    }
  }

  // if quotelist is empty of quote isn't found
  if (quotelist.length <= 0 || quote == null)
    return <Text>Quote not found</Text>;

  let arrow = "arrow-right";
  let color = "gray";
  let symbol = "";

  // set positive or negative change
  if (quote.price - quote.open > 0) {
    arrow = "arrow-up";
    color = "#90EE90";
    symbol = "+";
  }
  if (quote.price - quote.open < 0) {
    arrow = "arrow-down";
    color = "red";
  }

  // truncating values
  let change = quote.change.substring(0, quote.change.length - 2);
  let changeP = quote.changep
    .substring(0, quote.changep.length - 3)
    .concat("%");

  return (
    <View style={styles.view}>
      <View style={styles.view}>
        <Text style={{ ...styles.text, ...{ marginRight: scaleSize(10) } }}>
          {change}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
          borderRadius: scaleSize(10),
          paddingRight: scaleSize(10),
          paddingLeft: scaleSize(5),
        }}
      >
        <Icon
          name={arrow}
          color={"white"}
          size={scaleSize(25)}
          style={{ alignSelf: "center" }}
        />
        <Text style={styles.text}>{changeP}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "right",
    textAlignVertical: "center",
    color: "white",
    fontSize: scaleSize(17),
  },
  view: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
