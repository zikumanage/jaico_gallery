<template>
  <div class="scroll_container">
    <div class="sticky_wrap">
      <Transition name="fade">
        <img class="header__logo" src="~/assets/images/logo_w.png" v-show="scrollChange01">
      </Transition>
      <div class="horizontal_scroll" id="scroll">
          <div class="scroll_contents fv">
            <img class="fv__logo" src="~/assets/images/logo_b.png">
          </div>
        <Transition name="fade">
          <div class="scroll_contents pick_up_01" v-show="scrollChange01">
            <img class="pick_up_01__banner slide-in" src="~/assets/images/backnumber/2023_01.jpg">
          </div>
        </Transition>
        <Transition name="fade">
          <div class="scroll_contents pick_up_02" v-show="scrollChange02">
            <img class="pick_up_02__banner slide-in" src="~/assets/images/backnumber/2022_01.jpg">
          </div>
        </Transition>
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
      </div>
    </div>
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

//slideっぽい移動
const scrollChange01 = ref(false)
const scrollChange02 = ref(false)
const scrollChange03 = ref(false)

//一時スクロールイベントを止める
const noscroll = ( e ) => {
    e.preventDefault()
  }

const scrollstop = () => { 
  document.addEventListener('touchmove', noscroll, {passive: false})
  document.addEventListener( 'wheel', noscroll, { passive: false } )
  // console.log('off')
  setTimeout(() => {
    document.removeEventListener('touchmove', noscroll)
    document.removeEventListener( 'wheel', noscroll)
    console.log('on')
  }, 1000)
}

const transformX = (section) => {
  const offsetTop = section.parentElement.offsetTop;

  const scrollSection = section.querySelector('.horizontal_scroll')

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100

  // percentage = percentage < 0 ? 0 : percentage > 300 ? 300 : percentage
  // console.log(percentage)

  if (percentage > 10 && percentage < 150){

    // percentage = 100
    scrollChange01.value = true

  } else if (percentage > 150 && percentage < 250 ){

    // percentage = 200
    scrollChange02.value = true

  } else if (percentage > 250 && percentage < 301 ) {

    // percentage = 300
    scrollChange03.value = true

  } else if (percentage < 2 ) {
    scrollChange01.value = false
    scrollChange02.value = false
    scrollChange03.value = false
  }

  scrollSection.animate(
  {
    transform: `translate3d(${-(percentage)}vw, 0, 0)`
  },
  {
    fill: "forwards",
    duration: 3000
  }
)
  // scrollstop()
// scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`
};

const transformY = (section) => {
  const offsetTop = section.parentElement.offsetTop;

  const scrollSection = section.querySelector('.horizontal_scroll')

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100

  // console.log(percentage)

  if (percentage > 10 && percentage < 70){
    scrollChange01.value = true

  } else if (percentage > 70 && percentage < 140 ){
    scrollChange02.value = true

  } else if (percentage > 140 && percentage < 200 ) {
    scrollChange03.value = true

  } else if (percentage < 2 ) {
    scrollChange01.value = false
    scrollChange02.value = false
    scrollChange03.value = false
  }

  scrollSection.animate(
  {
    transform: `translate3d(0, ${-(percentage)}vh, 0)`
  },
  {
    fill: "forwards",
    duration: 3000
  }
)
};

onMounted(() => {
  const stickySections = [...document.querySelectorAll('.sticky_wrap')]
  
  window.addEventListener('scroll', (e) => {
    for(let i = 0; i < stickySections.length; i++){
      if(window.innerWidth > 768) {
        transformX(stickySections[i])
      } else {
        transformY(stickySections[i])
      }
    }
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
  z-index: 1;
  width: 190px;
  top: 60px;
  left: 60px;
  @include mq(sm) {
    width: 105px;
    top: 10px;
    left: 10px;
  }
}

.horizontal_scroll {
  overflow: auto;
  height: 100vh;
  width: 400vw;
  display: flex;
  @include mq(sm) {
    flex-direction: column;
    height: 400vh;
  }
}


.scroll_contents {
  height: 100vh;
  width: 100vw;
}

.sticky_wrap {
  overflow: hidden;
  position: sticky;
  top: 0;
  height: 100vh;
  @include mq(sm) {
    height: 200vh;
  }
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
  margin-top: 224px;
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
