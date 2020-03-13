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
    "sectionHeaderTitle":{
        "color":"#404853",
        "fontFamily": 'roboto-light',
        "fontSize":25,
        'textAlign': 'left',
    },
    "valueStyle":{
        "color":"#404853",
        "fontFamily": 'roboto-light',
        "fontSize":14,
        'textAlign': 'left'
    }
})