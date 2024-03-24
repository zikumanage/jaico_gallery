<template>
  <div class="scroll_container">
      <div class="sticky_wrap">
        <img class="header__logo" src="~/assets/images/logo_w.png">
        <div class="horizontal_scroll">
          <div class="scroll_contents fv">
            <img class="fv__logo" src="~/assets/images/logo_b.png">
          </div>
          <div class="scroll_contents pick_up_01">
            <img class="pick_up_01__banner" src="~/assets/images/backnumber/2023_01.jpg">
          </div>
          <div class="scroll_contents pick_up_02">
            <img class="pick_up_02__banner" src="~/assets/images/backnumber/2022_01.jpg">
          </div>
          <div class="scroll_contents gallery">
            <div class="gallery__wrap">
              <div class="gallery__links">
                <a @click="currentYear = 0"><img src="~/assets/images/link_2024.png"></a>
                <a @click="currentYear = 1"><img src="~/assets/images/link_2023.png"></a>
                <a @click="currentYear = 2"><img src="~/assets/images/link_2022.png"></a>
                <a @click="currentYear = 3"><img src="~/assets/images/link_2021.png"></a>
              </div>
              <div class="gallery__contents">
                <GallaryItem v-for="n in backnumberInfo[currentYear][1]" :length = "n" :year = "backnumberInfo[currentYear][0]" />
              </div>
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


const transform = (section) => {
  const offsetTop = section.parentElement.offsetTop;

  const scrollSection = section.querySelector('.horizontal_scroll')

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;

  percentage = percentage < 0 ? 0 : percentage > 300 ? 300 : percentage;

  scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`
};

onMounted(() => {
  const stickySections = [...document.querySelectorAll('.sticky_wrap')]
  
  window.addEventListener('scroll', (e) => {
    for(let i = 0; i < stickySections.length; i++){
      transform(stickySections[i])
    }
  })
})

</script>

<style lang="scss">

.scroll_container {
  height: 400vh;
}

.sticky_wrap {
  position: relative;
}

.header__logo {
  position: fixed;
  z-index: 1;
  width: 190px;
  top: 60px;
  left: 60px;
}

.horizontal_scroll {
  position: absolute;
  top: 0;
  height: 100%;
  width: 400vw;
  will-change: transform;
  display: flex;
  justify-content: space-between;
}

.scroll_contents {
  height: 100%;
  width: 100vw;
}

.sticky_wrap {
  overflow: hidden;
  position: sticky;
  top: 0;
  height: 100vh;
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
}



.pick_up_01 {
  background:url('~/assets/images/bg_02.jpg') center top / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pick_up_01__banner {
  height: 100vh;
}

.pick_up_02 {
  background:url('~/assets/images/bg_03.jpg') center top / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pick_up_02__banner {
  height: 100vh;
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
}

.gallery__links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  a {
    img {
      width: 83px;
    }
  }
}

.gallery__contents{
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
  img {
    height: 20vw;
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
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .gallery__overlayImage,
.fade-leave-active .gallery__overlayImage {
  transition: transform 0.5s ease;
}

.fade-enter-from .gallery__overlayImage,
.fade-leave-to .gallery__overlayImage {
  transform: translateX(100%);
}
</style>
