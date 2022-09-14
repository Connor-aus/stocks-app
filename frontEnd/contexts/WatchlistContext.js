import React, { useState, useEffect, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { DBURL } from "../components/DBURL";

const WatchlistContext = createContext();
export const useWatchlist = () => useContext(WatchlistContext);

// export watchlist
export const WatchlistProvider = ({ children }) => {
  const [state, setState] = useState([]);
  const [fetch, setFetch] = useState(false);
  const [quote, setQuote] = useState([]);
  const { token } = useAuth();

  // get watchlist from async storage
  let getWatchlist = async () => {
    try {
      const value = await AsyncStorage.getItem("@Watchlist");
      if (state.length <= 0 && token !== null && value !== null) {
        try {
          await getWatchlistFromDB(token, setState);
          console.log("Watchlist data retrieved from DB");
          return;
        } catch (error) {
          console.log(error);
        }
      } else if (value !== null) {
        let array = value.split(",");
        setState(array);
        setFetch(true);
        console.log("Watchlist data retrieved from async storage");
      }
    } catch (error) {
      console.log(`Failed to fetch data from Watchlist: ${error}`);
    }
  };

  useEffect(() => {
    (async () => {
      getWatchlist();
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      state.map((x) => addQuote(x, quote, setQuote));
    })();
  }, [fetch]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist: state,
        setState: setState,
        addStock: (x) => addStock(x, state, setState, token),
        removeStock: (x) => removeStock(x, state, setState, token),
        quotelist: quote,
        setQuote: setQuote,
        addQuote: (x) => addQuote(x, quote, setQuote),
        removeQuote: (x) => removeQuote(x, quote, setQuote),
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

async function addStock(stock, state, setState, token) {
  try {
    console.log("hitting this"); // todo
    // check to see if stock is already in watchlist
    let exists = false;
    state.map((x) => {
      if (x == stock) exists = true;
    });

    // stock already exists
    if (exists) {
      alert(`${stock} is already in watchlist`);
      return;
    }

    // adding to watch list
    setState((x) => {
      x.push(stock);
      x.sort();
      return [...x];
    });

    AsyncStorage.setItem("@Watchlist", state.toString());
    updateDatabase(state, token);
    console.log(stock + " added to wathlist");
  } catch (error) {
    console.log(`Failed to add ${stock} to watchlist: ${error}`);
  }
}

// removes stock from watchlist
function removeStock(stock, state, setState, token) {
  try {
    let stockIndex = state.findIndex((symbol) => symbol === stock);
    state.splice(stockIndex, 1);

    setState((state) => {
      return [...state];
    });

    AsyncStorage.setItem("@Watchlist", state.toString());
    updateDatabase(state, token);
  } catch (error) {
    console.log(`Failed to removing ${stock} from watchlist: ${error}`);
  }
}

async function updateDatabase(state, token) {
  const url = `${DBURL}/api/update`;

  let watchlist = state.join(",");

  try {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ watchlist: watchlist }),
    });

    let data = await res.json();

    if (data?.error == true) {
      console.log("Failed to update DB/n" + data.message);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getWatchlistFromDB(token, setState) {
  const url = `${DBURL}/api/watchlist`;

  try {
    let res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();
    console.log(data);
    if (data?.error == true) {
      console.log(data.message);
      return;
    } else {
      if (data.Watchlist[0].watchlist !== null) {
        let list = data.Watchlist[0].watchlist.split(",");
        setState(list);
        await AsyncStorage.setItem("@Watchlist", data.Watchlist[0].watchlist);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// add quote data to state
async function addQuote(stock, state, setQuote, token) {
  // check to see if quote is already in watchlist
  let exists = false;

  state.map((x) => {
    if (x.symbol === stock) exists = true;
  });

  // quote already exists
  if (exists) {
    return;
  }

  let quote = await getQuote(stock);

  setQuote((x) => {
    x.push(quote);
    return [...x];
  });
}

// fetches quote data
async function getQuote(stock) {
  const AA_API_KEY = "NHGS3IDIQ0OIJCEX";
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${AA_API_KEY}`;

  try {
    let res = await fetch(url);
    let data = await res.json();
    // let data = tableData;
    let quote = QuoteMap(data["Global Quote"]);

    return quote;
  } catch (error) {
    console.log(`Failed to retrieve quote data for ${stock}: ${error}`);
  }
}

// maps quote data to usable json object
function QuoteMap(data) {
  return {
    symbol: data["01. symbol"],
    open: data["02. open"],
    high: data["03. high"],
    low: data["04. low"],
    price: data["05. price"],
    volume: data["06. volume"],
    latest: data["07. latest trading day"],
    previous: data["08. previous close"],
    change: data["09. change"],
    changep: data["10. change percent"],
  };
}

// removes quote from quoteHistory
function removeQuote(stock, state, setQuote) {
  try {
    let stockIndex = state.findIndex((symbol) => symbol.symbol === stock);
    state.splice(stockIndex, 1);

    setQuote((state) => {
      return [...state];
    });
    console.log(state);
  } catch (error) {
    console.log(`Error removing quote data ${stock}: ${error}`);
  }
}
