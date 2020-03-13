import React, {StyleSheet, Dimensions} from "react-native";
const {width, height} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
  "button": {
        "padding":12,
        "backgroundColor": "#fff",
        "borderColor": "#ddd",
        "borderWidth": 1,
        "alignSelf": "center",
        "borderRadius": 0,
        "marginTop": 10,
        "marginBottom": 10,
        "flex":1,
        "flexDirection":'row',
        "alignSelf": "stretch",
        "alignItems": "center",
        "justifyContent": "center",
    },
    "buttonText": {
        "color": "#333",
        "alignSelf": "center",
        "fontSize": 14
    }});
