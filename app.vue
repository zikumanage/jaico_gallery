<template>
  <div class="scroll_container">
    <Swiper
      :modules="[SwiperMousewheel,SwiperEffectFade,SwiperEffectCube,SwiperParallax]"
      :direction="'vertical'"
      :autoHeight="true"
      :allowTouchMove="false"
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
        </div>
        <div class="scroll_contents fv only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="fv__logo" src="~/assets/images/logo_b.png" data-swiper-parallax-y="-70%">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents pick_up_01 only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png" data-swiper-parallax-x="-60%">
          <img class="pick_up_01__banner slide-in" src="~/assets/images/backnumber/2023_01.jpg" data-swiper-parallax-x="-70%">
        </div>
        <div class="scroll_contents pick_up_01 only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png" data-swiper-parallax-y="-60%">
          <img class="pick_up_01__banner slide-in" src="~/assets/images/backnumber/2023_01.jpg" data-swiper-parallax-y="-70%">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents pick_up_02 only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png" data-swiper-parallax-x="-60%">
          <img class="pick_up_02__banner slide-in" src="~/assets/images/backnumber/2022_01.jpg" data-swiper-parallax-x="-70%">
        </div>
        <div class="scroll_contents pick_up_02 only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png" data-swiper-parallax-y="-60%">
          <img class="pick_up_02__banner slide-in" src="~/assets/images/backnumber/2022_01.jpg" data-swiper-parallax-y="-70%">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents gallery only-pc" data-swiper-parallax-x="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png" data-swiper-parallax-x="-60%">
          <div class="gallery__wrap" data-swiper-parallax-x="-70%">
            <div class="gallery__links">
              <a @click="currentYear = 0;isDisplay()"><img src="~/assets/images/link_2024.png"></a>
              <a @click="currentYear = 1;isDisplay()"><img src="~/assets/images/link_2023.png"></a>
              <a @click="currentYear = 2;isDisplay()"><img src="~/assets/images/link_2022.png"></a>
              <a @click="currentYear = 3;isDisplay()"><img src="~/assets/images/link_2021.png"></a>
            </div>
            <Transition name="fade">
              <div class="gallery__contents" v-if="contentsDisplay">
                <GallaryItem v-for="n in backnumberInfo[currentYear][1]" :key="n" :length="n" :year="backnumberInfo[currentYear][0]" />
              </div>
            </Transition>
          </div>
        </div>
        <div class="scroll_contents gallery only-sp" data-swiper-parallax-y="90%" data-swiper-parallax-opacity="0">
          <img class="header__logo" src="~/assets/images/logo_w.png" data-swiper-parallax-y="-60%">
          <div class="gallery__wrap" data-swiper-parallax-y="-70%">
            <div class="gallery__links">
              <a @click="currentYear = 0;isDisplay()"><img src="~/assets/images/link_2024.png"></a>
              <a @click="currentYear = 1;isDisplay()"><img src="~/assets/images/link_2023.png"></a>
              <a @click="currentYear = 2;isDisplay()"><img src="~/assets/images/link_2022.png"></a>
              <a @click="currentYear = 3;isDisplay()"><img src="~/assets/images/link_2021.png"></a>
            </div>
            <Transition name="fade">
              <div class="gallery__contents" v-if="contentsDisplay">
                <GallaryItem v-for="n in backnumberInfo[currentYear][1]" :key="n" :length="n" :year="backnumberInfo[currentYear][0]" />
              </div>
            </Transition>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">

const backnumberInfo = ref(
  [ 
    [2024,3],
    [2023,4],
    [2022,1],
    [2021,3]
  ]
)

const currentYear = ref(0)

//gallery__contentsのアニメーション効果
const contentsDisplay = ref(true)

const isDisplay = () => {
    contentsDisplay.value = false
    setTimeout(() => {
      contentsDisplay.value = true
  }, 500)
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
  margin-left: 5.9vw;
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
  flex-direction: row-reverse;
  gap: 20px;
  @include mq(sm) {
    height: auto;
    padding: 0 0 30px;
    box-sizing: border-box;
    justify-content: flex-end;
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
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
  background-color: #00000090;
  @include mq(sm) {
    transform: translateX(-6vw);
  }
  .gallery__overlayImage {
    height: 100vh;
    width: auto;
    max-width: 100vw;
    object-fit: contain;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .slide-in,
.fade-leave-active .slide-in {
  transition: transform 2s ease;
}

.fade-enter-from .slide-in,
.fade-leave-to .slide-in {
  transform: translateX(100%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.5s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active .slide-in,
.overlay-leave-active .slide-in {
  transition: transform 0.5s ease;
}

.overlay-enter-from .slide-in,
.overlay-leave-to .slide-in {
  transform: translateX(100%);
}
</style>
