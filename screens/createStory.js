import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Button,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";
let customFonts = {
  "Mario-Kart-DS": require("../assets/Mario-Kart-DS.ttf"),
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image1",
      dropdownHeight: 40,
    };
  }

  async addStory() {
    if (
      this.state.title &&
      this.state.description &&
      this.state.story &&
      this.state.moral
    ) {
      let storyData = {
        preview_image: this.state.previewImage,
        title: this.state.title,
        description: this.state.description,
        story: this.state.story,
        moral: this.state.moral,
        author: firebase.auth().currentUser.displayName,
        created_on: new Date(),
        author_uid: firebase.auth().currentUser.uid,
        likes: 0,
      };
      await firebase
        .database()
        .ref("/posts/" + Math.random().toString(36).slice(2))
        .set(storyData)
        .then(function (snapshot) {});
      //this.props.setUpdateToTrue();
      this.props.navigation.navigate("Feed");
    } else {
      Alert.alert(
        "Error",
        "Todos os campos são obrigatórios!🤬",
        [{ text: "OK", onPress: () => console.log("OK Pressionado") }],
        { cancelable: false }
      );
    }
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let preview_images = {
        image1: require("../assets/caoalgebra.jpg"),
        image2: require("../assets/caobiologia.png"),
        image3: require("../assets/caofisica.jpg"),
        image4: require("../assets/caogeografia.jpg"),
        image5: require("../assets/caogeometria.jpg"),
        image6: require("../assets/caogramatica.png"),
        image7: require("../assets/caohistoria.jpg"),
        image8: require("../assets/caoingles.png"),
        image9: require("../assets/caoliteratura.png"),
        image10: require("../assets/caoquimica.png"),
        image11: require("../assets/caoredacao.png"),
      };
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>d=====(￣▽￣*)b</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}
              ></Image>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Álgebra", value: "image1" },
                    { label: "Biologia", value: "image2" },
                    { label: "Física", value: "image3" },
                    { label: "Geografia", value: "image4" },
                    { label: "Geometria", value: "image5" },
                    { label: "Gramática", value: "image6" },
                    { label: "História", value: "image7" },
                    { label: "Inglês", value: "image8" },
                    { label: "Literatura", value: "image9" },
                    { label: "Química", value: "image10" },
                    { label: "Redação", value: "image11" },
                  ]}
                  defaultValue={this.state.previewImage}
                  open={this.state.dropdownHeight == 170 ? true : false}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "white",
                    color: "white",
                  }}
                  textStyle={{
                    color: this.state.dropdownHeight == 170 ? "black" : "white",
                    fontFamily: "Mario-Kart-DS",
                  }}
                  onSelectItem={(item) =>
                    this.setState({
                      previewImage: item.value,
                    })
                  }
                  onChangeItem={(item) =>
                    this.setState({
                      previewImage: item.value,
                    })
                  }
                  placeholder={this.state.previewImage}
                />
              </View>

              <TextInput
                style={styles.inputFont}
                onChangeText={(title) => this.setState({ title })}
                placeholder={"Título"}
                placeholderTextColor="white"
              />

              <TextInput
                style={[
                  styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(description) => this.setState({ description })}
                placeholder={"Descrição"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="white"
              />
              <TextInput
                style={[
                  styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(story) => this.setState({ story })}
                placeholder={"Resumo"}
                multiline={true}
                numberOfLines={20}
                placeholderTextColor="white"
              />

              <TextInput
                style={[
                  styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(moral) => this.setState({ moral })}
                placeholder={"Observações"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="white"
              />
              <View style={styles.submitButton}>
                <Button
                  onPress={() => this.addStory()}
                  title="Submit"
                  color="#841584"
                />
              </View>
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Mario-Kart-DS",
  },
  fieldsContainer: {
    flex: 0.85,
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain",
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "white",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    paddingLeft: RFValue(10),
    color: "white",
    fontFamily: "Mario-Kart-DS",
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: "top",
    padding: RFValue(5),
  },
  submitButton: {
    marginTop: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
  },
});
