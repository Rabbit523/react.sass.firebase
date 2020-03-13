/*
Created by Dimov Daniel
Mobidonia
*/
import React from "react";
import { View, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import Navbar from '@components/Navbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import Smartrow from '@smartrow'
import fun from '@functions/common';
import { LinearGradient } from 'expo-linear-gradient'
import MapView, {
  ProviderPropType,
  Marker,
  AnimatedRegion,
} from 'react-native-maps';

const ConditionalWrap = ({ condition, wrap, children }) => condition ? wrap(children) : children;



export default class MapScreen extends React.Component {

  //Key extractor for the Flat list
  _keyExtractor = (item) => item.id;

  //The constructor
  constructor(props) {
    super(props);

    var isDataInProps = props.navigation.state.params == null
    this.state = {
      title: props.data.name,
      pr: isDataInProps ? props.data : props.navigation.state.params,
      items: [],
      itemsStore: [],
      animating: true,
      showSearch: false
    }

    this.focusMap = this.focusMap.bind(this);
    this.getData = this.getData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.markerPressed = this.markerPressed.bind(this);


  }

  componentDidMount() {
    //Get the Firestore data, based on the data_point, regular
    this.getData(this.state.pr.listingSetup ? this.state.pr.listingSetup.data_point : this.state.pr.data_point);
  }


  /**
    * STEP 1 - getData - gets data from Firestore
    * @param {String} pathRoot - Firestore path
    */
  getData(pathRoot) {

    //Get the meta data
    var path = pathRoot;

    //Get reference to this
    var _this = this;

    //Get references to firestore
    var db = firebase.firestore();
    var ref = db.collection(path);

    //Will putt data here
    var data = [];

    //If we have id, add where conditions to on the query
    if (this.state.pr.id) {
      //Filter by collections
      //In version 3.2.0, we have the key collection_key to let us know on what collection to query on
      var passedCollectionKey = this.state.pr.listingSetup ? this.state.pr.listingSetup.collection_key : this.state.pr.collection_key;
      var collection_key = passedCollectionKey != null && passedCollectionKey.length > 1 ? passedCollectionKey : "collection";


      ref = ref.where(collection_key, '==', db.doc(path + '_collection/' + this.state.pr.id))
    }

    //Now get the data
    ref.get()
      .then(snapshot => {
        var ids = [];
        var i = 0;
        snapshot
          .docs
          .forEach(doc => {
            var objToAdd = JSON.parse(doc._document.data.toString());
            //Add the id, on each object, easier for referencing
            objToAdd.id = doc.id;
            objToAdd.displayIndex = i;
            i++;
            ids.push(doc.id);
            var asString = JSON.stringify(objToAdd);
            asString = asString.replace(new RegExp('"', 'g'), '');
            asString = asString.replace(new RegExp('{', 'g'), '');
            asString = asString.replace(new RegExp('}', 'g'), '');
            objToAdd.fullTextSearch = asString.toLowerCase();
            data.push(objToAdd);
          });


        //After data is stored in data, update the state
        //This will re-render the screen
        _this.setState({
          items: data,
          itemsStore: data,
          animating: false
        })

        console.log("--- Data ---");
        console.log(JSON.stringify(data));

        _this.focusMap(ids, true);
      });
  }


  focusMap(markers, animated) {

    var _this = this;
    setTimeout(function () {
      if (_this.map) {
        _this.map.fitToSuppliedMarkers(markers, animated);
      }

    },
      1500);
  }

  /**
    * openDetails - opens the details screen
    * @param {Object} item item to open
    */
  openDetails(item) {
    this.props.navigation.navigate('DetailsFromMap', { data: item })
  }



  /**
    * renderItem - render a row
    * @param {Object} data
    */
  renderItem(data) {
    //We have our real data in data.item since FlatList wraps the data
    var item = data.item;

    return (
      <TouchableOpacity onPress={() => { this.openDetails(item) }}>
        <Smartrow isListing={true} item={item} display={this.state.pr} showRating={this.state.pr.listingSetup.showRating}>
        </Smartrow>
      </TouchableOpacity>
    )
  }

  markerPressed(objecId) {
    var i = 0;
    this.state.items.forEach(element => {
      if (element.id == objecId) {
        this.flatList.scrollToIndex({ viewPosition: 0, index: element.displayIndex })
        i++;
      }
    });
  }

  render() {
    var shouldWeShowImageBg = css.dynamic.general.detailsBackgroundImage;
    if (shouldWeShowImageBg) {
      var bgGradient = ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'];
    } else {
      var bgGradient = [css.dynamic.general.detailsBackgroundColor || css.dynamic.general.backgroundColor, css.dynamic.general.detailsBackgroundColor || css.dynamic.general.backgroundColor];
      if (css.dynamic.general.detailsBackgroundGradient) {
        bgGradient = [];
        css.dynamic.general.detailsBackgroundGradient.map((item, index) => {
          bgGradient.push(item.color);
        })
      }
    }
    return (
      <ConditionalWrap
        condition={shouldWeShowImageBg}
        wrap={children => <ImageBackground
          source={require('@images/bg.jpg')}
          style={[css.layout.imageBackground, { flex: 1 }]}
        >{children}</ImageBackground>}
      >
        <LinearGradient colors={bgGradient} style={[{ flex: 1 }, css.layout.containerBackground]}>
          <Navbar navigation={this.props.navigation} isRoot={true} showRightButton={false} />
          <MapView
            ref={ref => { this.map = ref; }}
            style={{ flex: 1 }}>
            {this.state.items.map(marker => (
              <Marker
                key={marker.id + ""}
                identifier={marker.id + ""}
                coordinate={{ latitude: marker.eventLocation ? marker.eventLocation._lat : marker.location._lat, longitude: marker.eventLocation ? marker.eventLocation._long : marker.location._long }}
                title={fun.callFunction(marker.title, "trim~30")}
                description={fun.callFunction(marker.description, "trim~30")}
                onPress={e => this.markerPressed(e.nativeEvent.id)}
              >
              </Marker>
            ))}

          </MapView>
          <View style={css.layout.mapOverlay}>
            <FlatList
              ref={ref => { this.flatList = ref; }}
              style={{ marginBottom: 0 }}
              data={this.state.items}
              horizontal={true}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
            />
          </View>
        </LinearGradient>
      </ConditionalWrap>

    );
  }

}
