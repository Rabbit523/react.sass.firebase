import {StyleSheet, Dimensions } from "react-native";


const {width, height} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh),

    imgWidth=width,
    imgHeight=width*0.8,

    productImageW=Math.ceil((width-40)/3);




export default StyleSheet.create({
    "headerImage":{
      "flex": 1,
      "margin": 0,
      "marginLeft": 0,
      "marginRight": 0,
      "minWidth": imgWidth,
      "maxWidth": imgWidth,
      "height": imgHeight,
      "maxHeight":imgHeight,
    },
    "imageRowShadow":{
      "position": 'absolute',
      "left": 0,
      "right": 0,
      "bottom": 0,
      "height": 50,
      "flex":1,
      "paddingTop":20,
      "paddingLeft":10,
      "alignItems": "flex-start",
      "justifyContent": "center",
    },
    "imageRowTitleArea":{
      "flex":1,
      "justifyContent": "center",
      "alignItems":"center",
    },
    "singleImage":{
      "height":productImageW,
      "width":productImageW,
      "margin":4,
    }
});
