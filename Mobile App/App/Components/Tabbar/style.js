import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
var headerHeight=50;
const barHeight=30;
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "statusBar":{
      "height":20,
      "flexDirection": "row",
    },
    "barContent":{
      "marginTop":10,
      "marginBottom":10,
    },
    "container": {
        "height": headerHeight,
        "backgroundColor": "red",
        "flexDirection": "row",
        "justifyContent": "flex-start",
        "paddingLeft": 5,
        "paddingTop": 0,
        "paddingRight": 5
    },
    "containerBar": {
      //"height": barHeight,
      "backgroundColor": "red",
      "flexDirection": "row",
      "justifyContent": "flex-start",
      "paddingLeft": 5,
      "paddingRight": 5
  },
    "leftArea":{
      "flex":10,
      "height": headerHeight,
      "paddingBottom":5,
      "justifyContent": "flex-end",
      "alignItems":"flex-start"
    },
    "centerArea":{
      "flex":60,
      "marginLeft":10,
      "marginRight":36,
      "paddingBottom":5,
      "height": headerHeight,
      "justifyContent": "flex-end",
      "alignItems":"center",
    },
    "navLogo":{
      "height":30,
      "width":100,
    },
    "rightArea":{
      "flex":20,
      "height": headerHeight,
      "paddingBottom":5,
      "justifyContent": "flex-end",
      "alignItems":"flex-end"
    },
    "border":{
      "height":3,
      "marginLeft":5
    }

});