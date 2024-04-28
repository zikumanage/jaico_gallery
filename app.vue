<template>
  <div class="scroll_container">
    <Swiper
      :modules="[SwiperMousewheel,SwiperEffectFade,SwiperEffectCube,SwiperParallax]"
      :direction="'vertical'"
      :autoHeight="true"
      :slidesPerView="1"
      :mousewheel="{
        enabled:true
      }"
      :speed="1000"
      :parallax="true"
      :breakpoints="{
        768:{
          direction:'horizontal'
        }
      }"
      
    >
        
      <SwiperSlide>
        <div class="scroll_contents fv only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="fv__logo" src="~/assets/images/logo_b.png" data-swiper-parallax-x="-70%">
          <img class="fv__scroll" src="~/assets/images/scroll.png">
        </div>
        <div class="scroll_contents fv only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="fv__logo" src="~/assets/images/logo_b.png" data-swiper-parallax-y="-70%">
          <img class="fv__scroll" src="~/assets/images/scroll.png">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents pick_up_01 only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png">
          <img class="pick_up_01__banner slide-in" src="~/assets/images/backnumber/2023_04.jpg" data-swiper-parallax-x="-70%">
        </div>
        <div class="scroll_contents pick_up_01 only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png">
          <img class="pick_up_01__banner slide-in" src="~/assets/images/backnumber/2023_04.jpg" data-swiper-parallax-y="-70%">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents pick_up_02 only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png">
          <img class="pick_up_02__banner slide-in" src="~/assets/images/backnumber/2022_01.jpg" data-swiper-parallax-x="-70%">
        </div>
        <div class="scroll_contents pick_up_02 only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png">
          <img class="pick_up_02__banner slide-in" src="~/assets/images/backnumber/2022_01.jpg" data-swiper-parallax-y="-70%">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents gallery only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png">
          <div class="gallery__wrap" data-swiper-parallax-x="-70%">
            <div class="gallery__links">
              <a @click="currentYear = 0;isDisplay()"><img src="~/assets/images/link_2024.png"></a>
              <a @click="currentYear = 1;isDisplay()"><img src="~/assets/images/link_2023.png"></a>
              <a @click="currentYear = 2;isDisplay()"><img src="~/assets/images/link_2022.png"></a>
              <a @click="currentYear = 3;isDisplay()"><img src="~/assets/images/link_2021.png"></a>
            </div>
              <div class="gallery__contents" :class="{contentsDisplay: iscontentsDisplay}">
                <div>
                  <a class="swiperClose" @click="isOverlayDisplay = !isOverlayDisplay" v-show="isOverlayDisplay"><img src="~/assets/images/close.png"></a>
                  <Swiper :class="{OverlayDisplay : isOverlayDisplay}"
                    :style="{
                      '--swiper-navigation-color': '#fff',
                      '--swiper-navigation-size': '30px',
                    }"
                    :loop="true"
                    :spaceBetween="10"
                    :navigation="true"
                    :thumbs="{ swiper: thumbsSwiper }"
                    :modules="modules"
                    class="mySwiper2 gallery__overlay"
                  >
                    <SwiperSlide v-for="n in backnumberInfo[currentYear][1]" :key="n">
                      <!-- <img class="gallery__overlayImage slide-in" :src="imgSrc(backnumberInfo[currentYear][0],n)"> -->
                      <img class="gallery__overlayImage slide-in" :src="'https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/'+backnumberInfo[currentYear][0]+'_0'+n+'.jpg'">
                    </SwiperSlide>
                </Swiper>
                <Swiper
                    @swiper="setThumbsSwiper"
                    :spaceBetween="20"
                    :freeMode="true"
                    :modules="modules"
                    class="mySwiper"
                  >
                  <SwiperSlide v-for="n in backnumberInfo[currentYear][1]" :key="n">
                    <a @click="isOverlayDisplay = !isOverlayDisplay">
                      <!-- <img :src="imgSrc(backnumberInfo[currentYear][0],n)"> -->
                      <img :src="'https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/'+backnumberInfo[currentYear][0]+'_0'+n+'.jpg'">
                    </a>
                  </SwiperSlide>
                </Swiper>
                </div>
              </div>
          </div>
        </div>
        <div class="scroll_contents gallery only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png">
          <div class="gallery__wrap" data-swiper-parallax-y="-70%">
            <div class="gallery__links">
              <a @click="currentYear = 0;isDisplay();"><img src="~/assets/images/link_2024.png"></a>
              <a @click="currentYear = 1;isDisplay()"><img src="~/assets/images/link_2023.png"></a>
              <a @click="currentYear = 2;isDisplay()"><img src="~/assets/images/link_2022.png"></a>
              <a @click="currentYear = 3;isDisplay()"><img src="~/assets/images/link_2021.png"></a>
            </div>
              <div class="gallery__contents" :class="{contentsDisplay: iscontentsDisplay}">
                <a class="swiperClose" @click="isOverlayDisplay = !isOverlayDisplay" v-show="isOverlayDisplay"><img src="~/assets/images/close.png"></a>
                <Swiper :class="{OverlayDisplay : isOverlayDisplay}"
                    :style="{
                      '--swiper-navigation-color': '#fff',
                      '--swiper-navigation-size': '24px',
                    }"
                    :loop="true"
                    :spaceBetween="10"
                    :navigation="true"
                    :thumbs="{ swiper: thumbsSwiperSP }"
                    :modules="modules"
                    class="mySwiper2 gallery__overlay"
                  >
                    <SwiperSlide v-for="n in backnumberInfo[currentYear][1]" :key="n">
                      <!-- <img class="gallery__overlayImage slide-in" :src="imgSrc(backnumberInfo[currentYear][0],n)"> -->
                      <img class="gallery__overlayImage slide-in" :src="'https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/'+backnumberInfo[currentYear][0]+'_0'+n+'.jpg'">
                    </SwiperSlide>
                </Swiper>
                <Swiper
                    @swiper="setThumbsSwiperSP"
                    :autoHeight="true"
                    :spaceBetween="20"
                    :freeMode="true"
                    :modules="modules"
                    :width="300"
                    class="mySwiper"
                  >
                  <SwiperSlide v-for="n in backnumberInfo[currentYear][1]" :key="n">
                    <a @click="isOverlayDisplay = !isOverlayDisplay">
                      <!-- <img :src="imgSrc(backnumberInfo[currentYear][0],n)"> -->
                      <img :src="'https://raw.githubusercontent.com/zikumanage/jaico_gallery/nested_swiper/assets/images/backnumber/'+backnumberInfo[currentYear][0]+'_0'+n+'.jpg'">
                    </a>
                  </SwiperSlide>
                </Swiper>
              </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

 // Import Swiper styles
 import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const modules = ref([FreeMode, Navigation, Thumbs]);

const thumbsSwiper = ref(null);
const thumbsSwiperSP = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
}

const setThumbsSwiperSP = (swiper) => {
  thumbsSwiperSP.value = swiper;
}

const backnumberInfo = ref(
  [ 
    [2024,4],
    [2023,4],
    [2022,1],
    [2021,3]
  ]
)
const currentYear = ref(0)

const isOverlayDisplay = ref(false)

// const imgSrc = (year : number, n : number) => {
//     return new URL(`/assets/images/backnumber/${year}_0${n}.jpg`, import.meta.url).href
// }

// let image = {
//   default:''
// }

// try {
//   image = await import(`~/assets/images/backnumber/${props.year}_0${props.length}.jpg`)
// } catch (e) {
//   console.log(e)
// }

//gallery__contentsのアニメーション効果
const iscontentsDisplay = ref(true)

const isDisplay = () => {
    iscontentsDisplay.value = false
    setTimeout(() => {
      iscontentsDisplay.value = true
  }, 200)
}


onUpdated(() => {
})


</script>

<style lang="scss">

.scroll_container {
  width: 100%;
  height: 100%;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  width: 100%;
  // これ入れないとswiper縦に動かない
  height: auto !important;
}

.header__logo {
  position: fixed;
  z-index: 2;
  width: 190px;
  top: 40px;
  left: 60px;
  @include mq(sm) {
    width: 85px;
    top: 10px;
    left: 10px;
  }
}


.scroll_contents {
  height: 100vh;
  width: 100vw;
}

.fv {
  background:url('~/assets/images/bg_01.jpg') center top / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fv__logo {
  width: 54vw;
  max-width: 1042px;
  @include mq(sm) {
    width: 80vw;
  }
}

.fv__scroll {
  width: 40px;
  height: auto;
  position: absolute;
  left: 50vw;
  transform: translateX(-50%);
  animation: scroll 2s ease-in-out infinite; 
}

@keyframes scroll {
  0% {
    bottom: 30px;
  }
  50% {
    bottom: 50px;
  }
  100% {
    bottom: 30px;
  }
}

.pick_up_01 {
  background:url('~/assets/images/bg_02.jpg') center top / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pick_up_01__banner {
  height: 100vh;
  @include mq(sm) {
    height: auto;
    width: 100vw;
  }
}

.pick_up_02 {
  background:url('~/assets/images/bg_03.jpg') center top / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pick_up_02__banner {
  height: 100vh;
  @include mq(sm) {
    height: auto;
    width: 100vw;
  }
}

.gallery {
  position: relative;
  background:linear-gradient(to bottom ,#000000c8,#000000c8),url('~/assets/images/bg_01.jpg') center top / cover no-repeat;
}

.gallery__wrap {
  display: flex;
  gap: 45px;
  padding-left: 5.9vw;
  padding-top: 224px;
  @include mq(sm) {
    padding-top: 70px;
    align-items: flex-start;
  }
}

.gallery__links {
  display: flex;
  flex-direction: column;
  gap: 36px;
  a {
    img {
      width: 83px;
      @include mq(sm) {
        width: 52px;
      }
    }
  }
}

.gallery__contents{
  display: flex;
  flex-direction: row;
  gap: 20px;
  opacity: 0;
  @include mq(sm) {
    height: auto;
    padding: 0 0 30px;
    box-sizing: border-box;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: scroll;
    gap: 12px;
  }
  img {
    height: 20vw;
    @include mq(sm) {
      height: auto;
      width: 25vw;
    }
  }
}

.gallery__overlay {
  position: absolute!important;
  z-index: -1!important;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
  background-color: #00000090;
  opacity: 0;
  .gallery__overlayImage {
    height: 100vh;
    width: auto;
    max-width: 100vw;
    object-fit: contain;
  }
}

.mySwiper .swiper-wrapper {
  @include mq(sm) {
    flex-wrap: wrap;
    height: auto!important;
    transform: none!important;
  }
}

.mySwiper .swiper-slide {
  width: auto!important;
  height: 100%;
  @include mq(sm) {
    margin-bottom: 15px;
  }
}

.mySwiper .swiper-slide-thumb-active {
  opacity: 1;
}

.mySwiper2 {
  .swiper-slide {
    display: flex;
    justify-content: flex-end;
  }
}

.swiperClose {
  position: absolute;
  z-index: 99;
  top: 10px;
  left: 50vw;
  transform: translateX(-50%);
  @include mq(sm) {
    width: 40px;
    height: 40px;
  }
  img {
    width: 80px;
    height: 80px;
    @include mq(sm) {
      width: 30px;
      height: 30px;
    }
  }
}

.OverlayDisplay {
  z-index: 2!important;
  transition: all .1s ease;
  animation: overlay 1s ease forwards; 
}

@keyframes overlay {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.contentsDisplay {
  opacity: 1;
  transition: all .3s ease; 
}
</style>
