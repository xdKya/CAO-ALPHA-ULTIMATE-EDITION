import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import firebase from "firebase";

SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Mario-Kart-DS": require("../assets/Mario-Kart-DS.ttf"),
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      story_id: this.props.story.key,
      story_data: this.props.story.value,
      is_liked: false,
      likes: this.props.story.value.likes,
    };
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

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref("posts")
        .child(this.state.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref("posts")
        .child(this.state.story_id)
        .child("likes")
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      let story = this.state.story_data;
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
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            this.props.navigation.navigate("Tela de Resumos", {
              story: story,
              story_id: this.state.story_id,
            });
          }}
        >
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerClaro
                : styles.cardContainer
            }
          >
            <Image
              source={preview_images[story.preview_image]}
              style={styles.storyImage}
            ></Image>

            <View style={styles.titleContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.storyTitleTextClaro
                    : styles.storyTitleText
                }
              >
                {story.title}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.storyAuthorTextClaro
                    : styles.storyAuthorText
                }
              >
                {story.author}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.descriptionTextClaro
                    : styles.descriptionText
                }
              >
                {story.description}
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
          </View>
        </TouchableOpacity>
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
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20),
  },

  cardContainerClaro: {
    margin: RFValue(13),
    backgroundColor: "#F0F8FF",
    borderRadius: RFValue(20),
  },

  storyImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250),
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center",
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: "Mario-Kart-DS",
    color: "white",
  },
  storyTitleTextClaro: {
    fontSize: RFValue(25),
    fontFamily: "Mario-Kart-DS",
    color: "black",
  },
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: "Mario-Kart-DS",
    color: "white",
  },
  storyAuthorTextClaro: {
    fontSize: RFValue(18),
    fontFamily: "Mario-Kart-DS",
    color: "black",
  },
  descriptionText: {
    fontFamily: "Mario-Kart-DS",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10),
  },
  descriptionTextClaro: {
    fontFamily: "Mario-Kart-DS",
    fontSize: 13,
    color: "black",
    paddingTop: RFValue(10),
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
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
