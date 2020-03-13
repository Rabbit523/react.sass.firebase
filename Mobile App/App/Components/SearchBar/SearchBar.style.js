import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

export default StyleSheet.create({
    searchContainer: {
        width: viewportWidth,
        height: 80,
        padding:15,
    },
    searchInnerContainer:{
        width:"100%",
        height:"100%",
        backgroundColor:"white",
        borderRadius:25,
        flexDirection:"row"
    },
    iconContainer:{
        padding:13,
        paddingLeft:20,
        opacity:0.8
    },
    searchTextContainer:{
        padding:14,
        color:"gray"
    },
    serchText:{
         
    }
});