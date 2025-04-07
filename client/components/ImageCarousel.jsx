import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import Carousel  from 'react-native-reanimated-carousel';
const images =[
  require('../assets/images/PaniPuri.jpeg'),
  require('../assets/images/FriedRice.jpg'),
  require('../assets/images/Waffles.jpg')
];

const {width} = Dimensions.get("window");

export default function ImageCarousel(){
  // const activeIndex = useRef(0);
  // const scrollViewRef = useRef(null);
  // const scrollx = useSharedValue(0);

  // useEffect(()=>{
  //   const carouselLoop = () => {
  //     setTimeout(() => {
  //       if(activeIndex.current >= images.length){
  //         scrollViewRef.current?.scrollTo({x : 0, animated : false})
  //         activeIndex.current = 0
  //       }else{
  //         scrollViewRef.current?.scrollTo({x : activeIndex.current * width , animated : true})
  //         activeIndex.current += 1
  //       }
  //     }, 3000)
  //   }

  //   carouselLoop();
  // }, []);

  // const scrollHandler = useAnimatedScrollHandler((event) => {
  //   scrollx.value = event.contentOffset.x;
  // })
  
    return (
      <View>
          <Carousel
          loop
          width = {width}
          height={250}
          autoPlay
          autoPlayInterval={3000}
          data = {images}
          scrollAnimationDuration = {1000}
          renderItem = {({item}) => (
            <Image source = {item} className = "w-full h-full relative rounded-lg" resizeMode = 'cover' />
          )} />

      </View>
    )
  
}
