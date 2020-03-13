import React, { Component } from 'react'
import { Text, View,Platform} from 'react-native'
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import SliderImage from './SliderImage'
import { sliderWidth, itemWidth } from './../Slider/styles/SliderEntry.style';
import styles, { colors } from './../Slider/styles/index.style';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;

export default class HeaderImages extends Component {
    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
        this._renderItemWithParallax=this._renderItemWithParallax.bind(this);
        this._handleImageClick=this._handleImageClick.bind(this);
    }

    _handleImageClick(index){
        this.props.onPress(index);
    }

   
    _renderItemWithParallax ({item, index}, parallaxProps) {
        
        var realIndex=index-2;
        return (
            <SliderImage
              hasVideo={realIndex<1?this.props.hasVideo:false}
              data={item}
              even={(index + 1) % 2 === 0}
              index={realIndex}
              parallax={true}
              imageClick={this._handleImageClick}
              parallaxProps={parallaxProps}
            />
        );
    }

  render() { 
    const { slider1ActiveSlide } = this.state;
    
    return (
        <View>
            <Carousel
                  ref={c => this._slider1Ref = c}
                  data={this.props.photos?this.props.photos:[]}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={6000}
                  autoplayInterval={4000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <View style={{marginTop:-50}}>
                    <Pagination
                    dotsLength={(this.props.photos?this.props.photos:[]).length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={'white'}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={"white"}
                    inactiveDotOpacity={0.8}
                    inactiveDotScale={0.6}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                    />
                </View>
                <View style={{marginTop:30}}></View>
                
      </View>
    )
  }
}
