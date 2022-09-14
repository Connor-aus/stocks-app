import React from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useStocks } from "../contexts/StocksContext";
import { useWatchlist } from "../contexts/WatchlistContext";
import { SearchBar } from "@rneui/themed";
import { scaleSize } from "../constants/Layout";

export default function SearchScreen() {
  const { stocks } = useStocks();
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState(stocks);

  useEffect(() => {
    (async () => {
      setSearchList(await filterList(stocks, search));
    })();
  }, [stocks, search]);

  async function filterList(stocks, search) {
    return stocks.filter(
      (row) =>
        row.symbol.toLowerCase().includes(search.toLowerCase()) ||
        row.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <View styles={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
        placeholderTextColor="#808080"
      />
      <StockList list={searchList ?? "Stocklist not found"} />
    </View>
  );
}

function StockList(props) {
  if (props.list.length === 0)
    return (
      <View
        style={{
          backgroundColor: "#202020",
          textAlign: "center",
          padding: 25,
        }}
      >
        <Text style={styles.stock_name}>No stocks found</Text>
      </View>
    );

  return (
    <ScrollView>
      {props.list.map((x) => (
        <Stock {...x} key={JSON.stringify(x)} />
      ))}
    </ScrollView>
  );
}

function Stock(props) {
  const { addStock } = useWatchlist();
  const { addQuote } = useWatchlist();

  return (
    <TouchableOpacity
      onPress={() => {
        addStock(props.symbol);
        addQuote(props.symbol);
      }}
    >
      <View style={styles.stock_cell}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.stock_symbol}>{props.symbol}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
            }}
          >
            <Text style={styles.stock_name}>{props.name}</Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.stock_industry}>{props.sector}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  stock_cell: {
    padding: scaleSize(10),
    backgroundColor: "#202020",
    flexDirection: "column",
    borderBottomColor: "#808080",
    borderBottomWidth: 1,
  },
  stock_industry: {
    textAlign: "right",
    color: "#808080",
    fontSize: scaleSize(12),
  },
  stock_name: {
    flex: 6,
    flexDirection: "row",
    color: "#F0FFFF",
    fontSize: scaleSize(12),
  },
  stock_symbol: {
    color: "#87CEEB",
    fontWeight: "bold",
    fontSize: scaleSize(17),
  },
});
