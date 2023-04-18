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
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Speech from "expo-speech";
import firebase from "firebase";

SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Mario-Kart-DS": require("../assets/Mario-Kart-DS.ttf"),
};

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor: "gray",
      speakerIcon: "volume-high-outline",
      light_theme: true,
      is_liked: false,
      likes: this.props.route.params.story.likes,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({
          light_theme: theme === "light" ? true : false,
        });
      });
  }

  async speaker(title, author, story, moral) {
    const current_color = this.state.speakerColor;
    this.setState({
      speakerColor: current_color === "gray" ? "#ee8249" : "gray",
    });
    if (current_color === "gray") {
      Speech.speak(`${title} by ${author}`);
      Speech.speak(story);
      Speech.speak("Observações");
      Speech.speak(moral);
    } else {
      Speech.stop();
    }
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("posts")
        .child(this.props.route.params.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref("posts")
        .child(this.props.route.params.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
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
        <View
          style={
            this.state.light_theme ? styles.containerClaro : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextClaro
                    : styles.appTitleText
                }
              >
                Storytelling App
              </Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView
              style={
                this.state.light_theme
                  ? styles.storyCardClaro
                  : styles.storyCard
              }
            >
              <Image
                source={
                  preview_images[this.props.route.params.story.preview_image]
                }
                style={styles.image}
              ></Image>

              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyTitleTextClaro
                        : styles.storyTitleText
                    }
                  >
                    {this.props.route.params.story.title}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyAuthorTextClaro
                        : styles.storyAuthorText
                    }
                  >
                    {this.props.route.params.story.author}
                  </Text>
                  <Text
                    style={
                      this.state.light_theme
                        ? styles.storyAuthorTextClaro
                        : styles.storyAuthorText
                    }
                  >
                    {this.props.route.params.story.created_on}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => {
                    this.speaker(
                      this.props.route.params.story.title,
                      this.props.route.params.story.author,
                      this.props.route.params.story.story,
                      this.props.route.params.story.moral
                    );
                  }}
                >
                  <Ionicons
                    name={this.state.speakerIcon}
                    size={RFValue(30)}
                    color={this.state.speakerColor}
                    style={{ margin: RFValue(15) }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.storyAuthorText}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.storyTextClaro
                      : styles.storyText
                  }
                >
                  {this.props.route.params.story.story}
                </Text>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.moralTextClaro
                      : styles.moralText
                  }
                >
                  Observações: {this.props.route.params.story.moral}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={
                    this.state.is_liked
                      ? styles.likeButtonLiked
                      : styles.likeButtonDisliked
                  }
                  onPress={() => this.likeAction()}
                >
                  <Ionicons
                    name={"heart"}
                    size={RFValue(30)}
                    color={this.state.light_theme ? "black" : "white"}
                  />

                  <Text
                    style={
                      this.state.light_theme
                        ? styles.likeTextLight
                        : styles.likeText
                    }
                  >
                    {this.state.likes}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30),
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#eb3948",
    borderWidth: 2,
    borderRadius: RFValue(30),
  },
  likeText: {
    color: "white",
    fontFamily: "Mario-Kart-DS",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6,
  },
  likeTextLight: {
    fontFamily: "Mario-Kart-DS",
    fontSize: 25,
    marginLeft: 25,
    marginTop: 6,
  },

  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  containerClaro: {
    flex: 1,
    backgroundColor: "white",
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
  appTitleTextClaro: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Mario-Kart-DS",
  },
  storyContainer: {
    flex: 1,
  },
  storyCardClaro: {
    margin: RFValue(20),
    backgroundColor: "#FAEBD7",
    borderRadius: RFValue(20),
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20),
  },
  image: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: "contain",
  },
  dataContainer: {
    flexDirection: "row",
    padding: RFValue(20),
  },
  titleTextContainer: {
    flex: 0.8,
  },
  storyTitleText: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(25),
    color: "white",
  },
  storyTitleTextClaro: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(25),
    color: "black",
  },

  storyAuthorTextClaro: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(18),
    color: "black",
  },

  storyAuthorText: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(18),
    color: "white",
  },
  iconContainer: {
    flex: 0.2,
  },
  storyTextContainer: {
    padding: RFValue(20),
  },
  storyText: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(15),
    color: "white",
  },
  storyTextClaro: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(15),
    color: "black",
  },
  moralText: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(20),
    color: "white",
  },
  moralTextClaro: {
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(20),
    color: "black",
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: "row",
    backgroundColor: "#eb3948",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(30),
  },
  likeText: {
    color: "white",
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
  likeTextClaro: {
    color: "black",
    fontFamily: "Mario-Kart-DS",
    fontSize: RFValue(25),
    marginLeft: RFValue(5),
  },
});
