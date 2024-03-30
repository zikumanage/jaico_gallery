<template>
  <div class="scroll_container">
    <Transition name="fade">
      <img class="header__logo" src="~/assets/images/logo_w.png" v-show="true">
    </Transition>
    <Swiper
      :modules="[SwiperMousewheel,SwiperEffectFade,SwiperEffectCube]"
      :slides-per-view="1"
      :loop="false"
      :mousewheel="{
        enabled:true
      }"
      :parallax="true"
      :speed="1000"
    >
        
      <SwiperSlide>
        <div class="scroll_contents fv">
          <img class="fv__logo" src="~/assets/images/logo_b.png">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents pick_up_01">
          <img class="pick_up_01__banner slide-in" src="~/assets/images/backnumber/2023_01.jpg">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents pick_up_02">
          <img class="pick_up_02__banner slide-in" src="~/assets/images/backnumber/2022_01.jpg">
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="scroll_contents gallery">
          <div class="gallery__wrap">
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
    [2024,2],
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


onMounted(() => {
  const activeSections = document.querySelector('.swiper-slide-active')
  
  window.addEventListener('scroll', (e) => {
    
  })
  
})


</script>

<style lang="scss">

.scroll_container {
  height: 400vh;
  width: 100vw;
  @include mq(sm) {
    height: 300vh;
  }
}

.header__logo {
  position: fixed;
  z-index: 2;
  width: 190px;
  top: 60px;
  left: 60px;
  @include mq(sm) {
    width: 105px;
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
    margin-top: 70px;
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
    flex-wrap: wrap-reverse;
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
