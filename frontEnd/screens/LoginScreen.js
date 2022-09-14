import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { scaleSize } from "../constants/Layout";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../contexts/AuthContext";
import stockImage from "../assets/images/stockImage.png";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  //Check login details agains criteria
  function loginCheck() {
    if (email.length == 0 || password.length == 0) {
      alert("Must complete both fields\nTry again!");
      return;
    }

    login(email, password);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.stockImage} source={stockImage} />
      </View>
      <View style={styles.heading}>
        <Text style={styles.heading_text}>Welcome to Stockings</Text>
      </View>
      <View style={styles.container_2}>
        <View style={styles.subsection}></View>
        <View style={styles.table}>
          <Icon
            name={"arrow-right"}
            color={"#87CEEB"}
            size={scaleSize(20)}
            style={styles.icon}
          />
          <TextInput
            placeholder="email"
            placeholderTextColor="#808080"
            style={styles.input}
            onChangeText={(x) => setEmail(x)}
          />
        </View>
        <View style={styles.table}>
          <Icon
            name={"arrow-right"}
            color={"#87CEEB"}
            size={scaleSize(20)}
            style={styles.icon}
          />

          <TextInput
            secureTextEntry={true}
            placeholderTextColor="#808080"
            placeholder="password"
            style={styles.input}
            onChangeText={(x) => setPassword(x)}
          />
        </View>
        <View style={styles.link}>
          <TouchableOpacity style={styles.button} onPress={() => loginCheck()}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.link}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <View style={styles.subsection_2}>
              <Text style={styles.register_text}>
                Are you new? Register now!
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    margin: scaleSize(50),
  },
  container_2: {
    paddingTop: scaleSize(30),
    flex: 2,
    width: "100%",
    justifyContent: "center",
  },
  header: {
    flex: 1,
    paddingHorizontal: scaleSize(20),
    justifyContent: "center",
  },
  heading: {
    height: scaleSize(50),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    padding: scaleSize(10),
    paddingTop: scaleSize(15),
  },
  heading_text: {
    color: "white",
    fontSize: scaleSize(20),
    fontStyle: "italic",
    textAlign: "center",
  },
  icon: {
    marginRight: scaleSize(10),
    alignSelf: "center",
  },
  input: {
    color: "white",
    width: "80%",
  },
  link: {
    flex: 2,
    flexDirection: "row",
    width: "100%",
    marginTop: scaleSize(20),
    height: scaleSize(50),
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  table: {
    height: scaleSize(45),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    padding: scaleSize(10),
    margine: scaleSize(10),
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  text: {
    color: "white",
    fontSize: scaleSize(16),
    textAlignVertical: "center",
  },
  register_text: {
    color: "white",
    fontSize: scaleSize(12),
    textAlignVertical: "center",
  },
  stockImage: {
    width: scaleSize(200),
    height: scaleSize(100),
    paddingBottom: scaleSize(-250),
    marginBottom: scaleSize(-50),
    marginLeft: scaleSize(20),
  },
  subsection: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  subsection_2: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});
