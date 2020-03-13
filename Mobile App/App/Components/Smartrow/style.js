import {StyleSheet, Dimensions} from "react-native";
const standardRowHeight=70;
const imageRowHeight=170;
const {width, height} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh),
    listImgWidth=vw * 30;


export default StyleSheet.create({
    "listWraper":{
      "marginTop": 8,
      "marginRight": 8,
      "marginBottom": 8,
      "marginLeft": 8,
      "shadowColor": "#000",
      "shadowOpacity": 0.2,
      "shadowRadius": 8,
      "shadowOffset": {width: 0, height: 3},
      "flexDirection": 'row'
    },
    "NotificationWraper":{
      "marginTop": 8,
      "marginRight": 8,
      "marginBottom": 8,
      "marginLeft": 8,
      "shadowColor": "#000",
      "shadowOpacity": 0.2,
      "shadowRadius": 8,
      "shadowOffset": {width: 0, height: 3},
      "flexDirection": 'row'
    },
    "listRow":{
      "flex":1,
      "flexDirection": 'row'
    },
    "imageInList": {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 8,
        "marginBottom": 10,
        "alignItems": "center",
        "justifyContent": "center",
        "position": "relative",
        "width": listImgWidth,
        "height": listImgWidth,
        "resizeMode": "cover",
      
    },
    "iconInNotification": {
      "marginTop": 10,
      "marginLeft": 10,
      "marginRight": 8,
      "marginBottom": 10,
      "alignItems": "center",
      "justifyContent": "center",
      "position": "relative",
      "width": 30,
      "height": 30
  },
    "infoPanelInList": {
        "width": vw * 60
    },
    "infoPanelInNotification": {
      "width": width-68
  },
    "infoPanelInListWithCart": {
        "width": vw * 48
    },
    "titleinList": {
        "fontSize": 16,
        "marginLeft": 8,
        "marginTop": 8,
        "marginRight": 8,
        "color": "#666b73",
        "fontWeight": "bold",
        "fontFamily": 'lato-bold',
        "backgroundColor":"rgba(0,0,0,0.0)",
      
    },
    "titleinNotification": {
      "fontSize": 14,
      "marginLeft": 4,
      "marginRight": 0,
      "fontWeight": "400",
      "fontFamily": 'open-sans'
      
  },
    "descriptionInList": {
        "fontSize": 12,
        "marginLeft": 4,
        "marginTop": 4,
        "marginRight": 0,
        "color": "#9c9ca2",
        "fontWeight": "300",
        "height":listImgWidth-48,
        "fontFamily": 'open-sans',
        "backgroundColor":"rgba(0,0,0,0.0)",
      
    },
    "descriptionInNotification": {
      "fontSize": 12,
      "marginTop": 8,
      "marginBottom": 8,
      "marginLeft": 4,
      "marginRight": 0,
      "fontWeight": "200",
      "fontFamily": 'open-sans'
  },
    "subtitleInList":{
        "fontSize": 13,
        "marginLeft": 8,
        "marginTop": 2,
        "marginRight": 8,
        "marginBottom":4,
        "color": "#333",
        "fontWeight": "400",
        "fontFamily": 'open-sans',
        "backgroundColor":"rgba(0,0,0,0.0)",
      
      },
    "timeList": {
        "marginLeft": 4,
        "marginRight": 8,
        "color": "#999",
        "fontSize": 11,
        "marginBottom": 10,
        "marginTop": 6,
        "backgroundColor": "transparent"
    },
    "category": {
        "fontSize": 11,
        "marginTop": 6,
        "color": "#999"
    },
    "standardRow":{
      "flex":1,
      "height": standardRowHeight,
      "flexDirection":"row",
      "justifyContent": "center",
      "alignItems":"center",
      "padding":5,
    },
    "standardRow2":{
      "flex":1,
      "height": 100,
      "flexDirection":"row",
      "justifyContent": "center",
      "alignItems":"center",
      "padding":5,
    },
    "standardRowImageIconArea":{
      "height":standardRowHeight-10,
      "flex":20,
      "justifyContent": "center",
      "alignItems":"center",
    },
    "standardRowImage":{
      "height":standardRowHeight-10,
      "width":standardRowHeight-10
    },
    "userImage":{
      "height":standardRowHeight-25,
      "width":standardRowHeight-25,
      "borderRadius":(standardRowHeight-25)/2
    },
    "standardRowTitleArea":{
      "height":standardRowHeight-10,
      "flex":80,
      "paddingLeft":5,
      "justifyContent": "center",
      "alignItems":"flex-start",
      
    },
    "standardRowTitleAreaUsers":{
      "height":standardRowHeight-10,
      "flex":80,
      "paddingLeft":5,
      "justifyContent": "space-between",
      "alignItems":"flex-start",
      
    },
    "standardRowArrowArea":{
      "height":standardRowHeight-10,
      "flex":10,
      "justifyContent": "center",
      "alignItems":"flex-end",
    },
    'standardRowSeparator':{
      "flex":1,
      "paddingLeft":5,
      "paddingRight":5,
    },
    "border":{
      "height":1,
    },
    "imageRowImage":{
      "height":imageRowHeight,
      "width":width,
    },
    "imageRowTitleArea":{
      "flex":1,
      "justifyContent": "center",
      "alignItems":"center",
    },
    "imageRowShadow":{
      "position": 'absolute',
      "left": 0,
      "right": 0,
      "bottom": 0,
      "height": width/2,
    },
    "tileImage1withSpace":{
      "flex": 1,
      "margin": 4,
      "marginLeft": 8,
      "marginRight": 8,
      "minWidth": width-16,
      "maxWidth": width-16,
      "height": width/2,
      "maxHeight":width/2,
    },
    "tileImage1noSpace":{
      "flex": 1,
      "margin": 0,
      "minWidth": width,
      "maxWidth": width,
      "height": width/2,
      "maxHeight":width/2,
      "borderRadius":0
    },
    "tileImage2withSpace":{
      "flex": 1,
      "margin": 4,
      "minWidth": width/2-8,
      "maxWidth": width/2-8,
      "height": width/2,
      "maxHeight":width/2,
    },
    "tileImage2noSpace":{
      "flex": 1,
      "margin": 0,
      "minWidth": width/2,
      "maxWidth": width/2,
      "height": width/2+40,
      "maxHeight":width/2+40,
      "borderRadius":0
    },
    "tileImage3withSpace":{
      "flex": 1,
      "margin": 4,
      "minWidth": width/3-8,
      "maxWidth": width/3-8,
      "height": width/3+40,
      "maxHeight":width/3+40,
      "borderRadius":4
    },
    "tileImage3noSpace":{
      "flex": 1,
      "margin": 0,
      "minWidth": width/3,
      "maxWidth": width/3,
      "height": width/3+40,
      "maxHeight":width/3+40,
      "borderRadius":0
    },
    "tileImage4withSpace":{
      "flex": 1,
      "margin": 4,
      "minWidth": width/4-8,
      "maxWidth": width/4-8,
      "height": width/4+40,
      "maxHeight":width/4+40,
      "borderRadius":4
    },
    "tileImage4noSpace":{
      "flex": 1,
      "margin": 0,
      "minWidth": width/4,
      "maxWidth": width/4,
      "height": width/4+40,
      "maxHeight":width/4+40,
      "borderRadius":0
    },
    "nameAndLastname":{
      "fontFamily": 'lato-bold',
      "fontSize": 14
    },
    "username":{
      "fontFamily": 'lato-regular',
      "fontSize": 12,
      "color":'#797980'
    }
});
