import React, { useState } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scaleSize } from "../constants/Layout";
import BottomSheet from "reanimated-bottom-sheet";
import Animated from "react-native-reanimated";
import { useWatchlist } from "../contexts/WatchlistContext";
import { useQuoteHistory } from "../contexts/QuoteHistoryContext";
import CloseButton from "../components/CloseButton";
import QuoteData from "../components/QuoteData";
import QuoteChart from "../components/QuoteChart";
import QuoteTable from "../components/QuoteTable";

export default function StockScreen() {
  const [stockSelect, setStockSelect] = useState("");
  const { watchlist } = useWatchlist();

  const bottomScreen = React.createRef();
  const drop = new Animated.Value(1);

  const openBottomScreen = () => {
    bottomScreen.current.snapTo(1);
  };

  const renderBottomScreen = () => (
    <View style={styles.panel}>
      <QuoteChart stock={stockSelect} />
      <QuoteTable stock={stockSelect} />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomScreen}
        callbackNode={drop}
        snapPoints={["65%", "42%", 0]}
        initialSnap={2}
        renderContent={renderBottomScreen}
        renderHeader={renderHeader}
        enabledGestureInteraction={true}
      />
      <View styles={styles.container}>
        <WatchList
          watchlist={watchlist ?? "Watchlist not found"}
          openBottomScreen={openBottomScreen}
          setSelection={setStockSelect}
        />
      </View>
    </View>
  );
}

function WatchList(props) {
  if (props.watchlist.length === 0) {
    return (
      <View
        style={{
          backgroundColor: "#202020",
          textAlign: "center",
          padding: 25,
        }}
      >
        <Text
          style={{
            color: "#F0FFFF",
            textAlign: "center",
            fontSize: 15,
            fontStyle: "italic",
          }}
        >
          Watchlist is empty
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {props.watchlist.map((x) => (
        <WatchedStock
          stock={x}
          key={x}
          openBottomScreen={props.openBottomScreen}
          setSelection={props.setSelection}
        />
      ))}
    </ScrollView>
  );
}

function WatchedStock(props) {
  const { removeStock } = useWatchlist();
  const { removeQuote } = useWatchlist();
  const { addQuoteHistory } = useQuoteHistory();

  return (
    <View style={styles.stock_cell}>
      <View
        style={{
          flex: 5,
          flexDirections: "row",
        }}
      >
        <TouchableOpacity
          onPress={async () => {
            await addQuoteHistory(props.stock);
            props.openBottomScreen();
            props.setSelection(props.stock);
          }}
        >
          <View>
            <View style={styles.stock}>
              <View style={styles.container}>
                <Text style={styles.stock_symbol}>{props.stock}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <QuoteData quote={props} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.close_button}>
        <CloseButton
          onPress={() => {
            removeStock(props.stock);
            removeQuote(props.stock);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close_button: {
    alignItems: "center",
    paddingRight: scaleSize(15),
    paddingLeft: scaleSize(15),
  },
  stock: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#202020",
    padding: scaleSize(15),
  },
  stock_cell: {
    flexDirection: "row",
    backgroundColor: "#202020",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  stock_symbol: {
    textAlignVertical: "center",
    textAlign: "left",
    color: "#87CEEB",
    fontWeight: "bold",
    fontSize: scaleSize(17),
  },
  panel: {
    backgroundColor: "#202020",
    padding: scaleSize(5),
    height: scaleSize(400),
  },
  header: {
    backgroundColor: "#202020",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: scaleSize(20),
    borderTopLeftRadius: scaleSize(10),
    borderTopRightRadius: scaleSize(10),
  },
  panelHeader: {
    alignItems: "center",
  },
  panelTitle: {
    fontSize: scaleSize(25),
    height: scaleSize(10),
  },
  panelHandle: {
    backgroundColor: "#87CEEB",
    height: scaleSize(8),
    width: scaleSize(40),
    borderRadius: scaleSize(4),
    marginBottom: scaleSize(10),
  },
});
