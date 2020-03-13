import {StyleSheet, Dimensions} from "react-native";
var headerHeight=70;
const {width, height} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);
if(height == 812)
{
  headerHeight = 85;

}

export default StyleSheet.create({
    "statusBar":{
      "height":20,
      "flexDirection": "row",
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
      "paddingBottom":10,
      "height": headerHeight,
      "justifyContent": "flex-end",
      "alignItems":"center",
      
    },
    "navLogo":{
      "height":30,
      "width":30,
      "borderRadius":15
    },
    "rightArea":{
      "flex":30,
      "height": headerHeight,
      "paddingBottom":10,
      "justifyContent": "flex-end",
      "alignItems":"flex-end",
      "flexDirection":"row",
      
    },
    "border":{
      "height":1
    }

});
