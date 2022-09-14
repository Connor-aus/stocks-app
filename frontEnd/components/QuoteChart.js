import React, { useState, useEffect } from "react";
import { Text, View, Dimensions } from "react-native";
import { scaleSize } from "../constants/Layout";
import { LineChart } from "react-native-chart-kit";
import { useQuoteHistory } from "../contexts/QuoteHistoryContext";
import LoadingSymbol from "./LoadingSymbol";

export default function QuoteChart(props) {
  const [chartLoading, setChartLoading] = useState(true);
  const [labels, setLabels] = useState();
  const [chartData, setChartData] = useState();
  const { quoteHistory } = useQuoteHistory();

  useEffect(() => {
    (async () => {
      try {
        // find corresponding stock in history data with map
        let result = [];

        quoteHistory.map((quote) => {
          if (quote["Meta Data"]["2. Symbol"] === props.stock)
            result.push(quote);
        });

        if (result.length <= 0) {
          return;
        }

        let data = Object.entries(result[0]["Time Series (Daily)"]).map(
          ([date, x]) => ({
            date,
            ...x,
          })
        );

        setLabels(await getLabels(data)); // set labels
        setChartData(await QuoteHistoryMap(data));
        setChartLoading(false);
      } catch (error) {
        console.log(
          `Quote history chart failed to load (may still be in construction): ${error}`
        );
      }
    })();
  }, [props.stock]);

  if (chartLoading) return <LoadingSymbol />;

  return (
    <View
      style={{
        alignItems: "center",
        paddingRight: scaleSize(40),
        paddingLeft: scaleSize(15),
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Historical Performance for {props.stock}
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={Dimensions.get("window").width - scaleSize(50)}
        height={scaleSize(200)}
        yAxisLabel="$"
        yAxisInterval={14}
        verticalLabelRotation={45}
        xLabelsOffset={-20}
        chartConfig={{
          backgroundColor: "#808080",
          backgroundGradientFrom: "#202020",
          backgroundGradientTo: "#87CEEB",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: scaleSize(15),
          },
          propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: "#202020",
          },
        }}
        bezier
        style={{
          marginVertical: scaleSize(15),
          marginRight: scaleSize(-30),
          borderRadius: scaleSize(15),
        }}
      />
    </View>
  );
}

async function getLabels(data) {
  let labels = data
    .map((stock) => stock.date.substring(2, stock.date.length))
    .reverse();

  //keep one label per fortnight
  for (let i = 1; i < labels.length; i++) {
    if ((i + 1) % 14 != 0) labels[i] = "";
  }

  return labels;
}

async function QuoteHistoryMap(data) {
  let arr = data.map((x) => {
    return parseFloat(x["4. close"]);
  });
  return arr;
}
