import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { scaleSize } from "../constants/Layout";
import { useWatchlist } from "../contexts/WatchlistContext";
import LoadingSymbol from "./LoadingSymbol";

export default function QuoteTable(props) {
  const [stockInfo, setstockInfo] = useState({});
  const [found, setFound] = useState(false);
  const { quotelist } = useWatchlist();

  useEffect(() => {
    (async () => {
      try {
        if (props.stock === "") return;

        let info;
        for (let i = 0; i < quotelist.length; i++) {
          if (quotelist[i].symbol === props.stock) {
            info = quotelist[i];
          }
        }

        setstockInfo(info);
        setFound(true);
      } catch (error) {
        console.log(
          `Quote Table failed to load (may still be in construction): ${error}`
        );
      }
    })();
  }, [props.stock, found]);

  if (props.stock === "" || !found) {
    console.log("chart loading");
    return <LoadingSymbol />;
  }

  return (
    <View style={styles.quote_table}>
      <Text style={styles.heading}>Today's Performance for {props.stock}</Text>
      <Grid style={styles.container}>
        <Col style={styles.container}>
          <Row>
            <View style={styles.row}>
              <Text style={styles.row_heading}>OPEN</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.row_value}>
                ${stockInfo.open.substring(0, stockInfo.open.length - 2)}
              </Text>
            </View>
          </Row>
          <Row>
            <View style={styles.row}>
              <Text style={styles.row_heading}>CLOSE</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.row_value}>
                ${stockInfo.price.substring(0, stockInfo.price.length - 2)}
              </Text>
            </View>
          </Row>
          <Row>
            <View style={styles.row}>
              <Text style={styles.row_heading}>VOLUME</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.row_value}>
                {stockInfo.volume.substring(0, stockInfo.volume.length - 2)}
              </Text>
            </View>
          </Row>
        </Col>
        <Col style={styles.container}>
          <Row>
            <View style={styles.row}>
              <Text style={styles.row_heading}>HIGH</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.row_value}>
                ${stockInfo.high.substring(0, stockInfo.high.length - 2)}
              </Text>
            </View>
          </Row>
          <Row>
            <View style={styles.row}>
              <Text style={styles.row_heading}>LOW</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.row_value}>
                ${stockInfo.low.substring(0, stockInfo.low.length - 2)}
              </Text>
            </View>
          </Row>
          <Row>
            <View style={styles.row}>
              <Text style={styles.row_heading}>CHANGE</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.row_value}>
                {stockInfo.change.substring(0, stockInfo.change.length - 2)}%
              </Text>
            </View>
          </Row>
        </Col>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    paddingBottom: scaleSize(5),
  },
  quote_table: {
    flex: 1,
    alignContent: "center",
    margin: 5,
    paddingRight: scaleSize(10),
    paddingLeft: scaleSize(10),
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(20),
    borderRadius: scaleSize(20),
    borderColor: "#87CEEB",
    borderWidth: 2,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: "#87CEEB",
    borderBottomWidth: 2,
  },
  row_heading: {
    textAlign: "left",
    color: "#808080",
    textAlignVertical: "center",
  },
  row_value: {
    textAlign: "right",
    color: "white",
    textAlignVertical: "center",
  },
});
